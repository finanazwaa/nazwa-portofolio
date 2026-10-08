"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Html, RoundedBox } from "@react-three/drei";
import { CanvasTexture, ImageLoader, MathUtils, Mesh, Object3D, Shape, SRGBColorSpace, Vector3, type Intersection, type Raycaster } from "three";
import { scrollToSection } from "@/components/site-chrome";
import { sceneDoors } from "@/lib/content";

type Door = (typeof sceneDoors)[number];

const LIGHT_BREATHING = true;

function SceneLighting() {
  const keyLight = useRef<Mesh>(null!);
  useFrame(({ clock }) => {
    if (!LIGHT_BREATHING || !keyLight.current) return;
    const light = keyLight.current as unknown as { intensity: number };
    light.intensity = 2.05 * (1 + Math.sin((clock.elapsedTime / 6) * Math.PI * 2) * 0.03);
  });
  return (
    <>
      <ambientLight intensity={0.66} />
      <directionalLight
        ref={keyLight as never}
        position={[-4.5, 7, 4]}
        intensity={2.05}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[3, 4, -2]} intensity={0.52} />
    </>
  );
}

function InteractiveDoor({
  door,
  position,
  chipPosition = [0, 0.72, 0],
  children,
}: {
  door: Door;
  position: readonly [number, number, number];
  chipPosition?: [number, number, number];
  children: ReactNode;
}) {
  const group = useRef<import("three").Group>(null!);
  const [hovered, setHovered] = useState(false);
  const leaveTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    window.clearTimeout(leaveTimer.current);
    document.body.style.cursor = "";
  }, []);

  function enter(event?: ThreeEvent<PointerEvent>) {
    event?.stopPropagation();
    if (leaveTimer.current !== undefined) window.clearTimeout(leaveTimer.current);
    setHovered(true);
    document.body.style.cursor = "pointer";
  }

  function leave(event?: ThreeEvent<PointerEvent>) {
    event?.stopPropagation();
    leaveTimer.current = window.setTimeout(() => {
      setHovered(false);
      document.body.style.cursor = "";
    }, 90);
  }

  // The page scrolls away from the pointer, so clear the hover state before scrolling.
  function select() {
    window.clearTimeout(leaveTimer.current);
    setHovered(false);
    document.body.style.cursor = "";
    scrollToSection(door.href);
  }

  function click(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    select();
  }

  useFrame((_, delta) => {
    if (group.current) {
      const lift = hovered ? 0.035 : 0;
      group.current.position.y = MathUtils.damp(group.current.position.y, lift, 13, delta);
    }
  });

  // drei's Html renders into a separate React root without Next's router context,
  // so the chip is a plain anchor rather than a TransitionLink. zIndexRange keeps it
  // below the sticky header (z-40). The wrapper ignores the pointer so only the chip
  // itself catches clicks; anything around it falls through to the object below.
  return (
    <group ref={group} position={position} onPointerOver={enter} onPointerOut={leave} onClick={click}>
      {children}
      {hovered && (
        <Html position={chipPosition} center distanceFactor={8} zIndexRange={[30, 0]} style={{ pointerEvents: "none", whiteSpace: "nowrap" }}>
          <a
            href={door.href}
            className="scene-chip"
            onPointerEnter={() => enter()}
            onPointerLeave={() => leave()}
            onClick={(event) => {
              event.preventDefault();
              select();
            }}
          >
            {door.number} — {door.chipLabel}
          </a>
        </Html>
      )}
    </group>
  );
}

function Laptop() {
  return (
    <group position={[0, -0.145, 0]}>
      <RoundedBox args={[2.72, 0.15, 1.72]} radius={0.07} smoothness={2} position={[0, 0.14, 0.35]} castShadow receiveShadow>
        <meshStandardMaterial color="#C7C9CC" roughness={0.82} metalness={0.08} />
      </RoundedBox>
      <RoundedBox args={[2.55, 1.48, 0.12]} radius={0.055} smoothness={2} position={[0, 0.92, -0.49]} rotation={[-0.12, 0, 0]} castShadow>
        <meshStandardMaterial color="#aeb0b2" roughness={0.8} metalness={0.06} />
      </RoundedBox>
      <mesh position={[0, 0.94, -0.418]} rotation={[-0.12, 0, 0]}>
        <planeGeometry args={[2.34, 1.28]} />
        <meshStandardMaterial color="#FAFAF7" emissive="#FAFAF7" emissiveIntensity={0.24} roughness={1} />
      </mesh>
      <mesh position={[0, 0.244, 0.19]}>
        <boxGeometry args={[1.36, 0.016, 0.57]} />
        <meshStandardMaterial color="#b2b4b6" roughness={1} />
      </mesh>
      <mesh position={[0, 0.248, 0.72]}>
        <boxGeometry args={[0.76, 0.012, 0.38]} />
        <meshStandardMaterial color="#a8aaac" roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.24, -0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 2.55, 16]} />
        <meshStandardMaterial color="#9da0a3" roughness={0.8} metalness={0.12} />
      </mesh>
    </group>
  );
}

function Notebook() {
  return (
    <group position={[0, -0.1, 0]} rotation={[0, -0.12, 0]}>
      <RoundedBox args={[1.9, 0.2, 2.05]} radius={0.06} smoothness={2} position={[0, 0.12, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#232323" roughness={0.92} />
      </RoundedBox>
      <mesh position={[0, 0.224, -0.02]}>
        <boxGeometry args={[1.7, 0.012, 1.84]} />
        <meshStandardMaterial color="#292927" roughness={0.96} />
      </mesh>
      {Array.from({ length: 9 }, (_, index) => (
        <mesh key={index} position={[-0.78 + index * 0.195, 0.25, -0.96]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.105, 0.017, 6, 12, Math.PI * 1.65]} />
          <meshStandardMaterial color="#9a9c9e" roughness={0.78} metalness={0.15} />
        </mesh>
      ))}
      <group position={[0.12, 0.31, 0.05]} rotation={[0.04, 0.1, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.035, 0.035, 1.18, 12]} />
          <meshStandardMaterial color="#C4402F" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.61, 0]}>
          <coneGeometry args={[0.035, 0.1, 12]} />
          <meshStandardMaterial color="#9f3427" roughness={0.86} />
        </mesh>
      </group>
    </group>
  );
}

function MugAndPencilCup() {
  return (
    <group position={[0, -0.11, 0]}>
      <group position={[-0.15, 0, 0.1]}>
        <mesh position={[0, 0.37, 0]} castShadow>
          <cylinderGeometry args={[0.33, 0.29, 0.68, 32, 1, true]} />
          <meshStandardMaterial color="#FAFAF7" roughness={0.9} side={2} />
        </mesh>
        <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.31, 0.035, 8, 32]} />
          <meshStandardMaterial color="#e4e0d6" roughness={0.92} />
        </mesh>
        <mesh position={[0.35, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.2, 0.045, 10, 24]} />
          <meshStandardMaterial color="#FAFAF7" roughness={0.9} />
        </mesh>
      </group>
      <group position={[0.48, 0, -0.55]}>
        <mesh position={[0, 0.34, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.25, 0.62, 24, 1, true]} />
          <meshStandardMaterial color="#c9b896" roughness={0.96} side={2} />
        </mesh>
        {[[-0.12, -0.02], [0.02, 0.03], [0.14, -0.04]].map(([x, z], index) => (
          <group key={index} position={[x, 0.7 + index * 0.045, z]} rotation={[0, 0, (index - 1) * 0.1]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.027, 0.027, 0.82, 8]} />
              <meshStandardMaterial color="#8b8b84" roughness={0.95} />
            </mesh>
            <mesh position={[0, 0.43, 0]}>
              <coneGeometry args={[0.027, 0.09, 8]} />
              <meshStandardMaterial color="#686963" roughness={0.96} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

const envelopeShape = new Shape();
envelopeShape.moveTo(-0.9, -0.62);
envelopeShape.lineTo(0.9, -0.62);
envelopeShape.lineTo(0.9, 0.62);
envelopeShape.lineTo(-0.9, 0.62);
envelopeShape.closePath();
const envelopeFlap = new Shape();
envelopeFlap.moveTo(-0.9, 0.62);
envelopeFlap.lineTo(0, -0.04);
envelopeFlap.lineTo(0.9, 0.62);
envelopeFlap.closePath();

function PhoneAndEnvelope() {
  return (
    <group position={[0, -0.12, 0]}>
      <mesh position={[0.62, 0.065, 0.54]} rotation={[-Math.PI / 2, 0, -0.08]} castShadow>
        <shapeGeometry args={[envelopeShape]} />
        <meshStandardMaterial color="#C8A97E" roughness={0.98} />
      </mesh>
      <mesh position={[0.62, 0.075, 0.54]} rotation={[-Math.PI / 2, 0, -0.08]}>
        <shapeGeometry args={[envelopeFlap]} />
        <meshStandardMaterial color="#d3b58e" roughness={0.98} />
      </mesh>
      <RoundedBox args={[0.82, 0.12, 1.48]} radius={0.11} smoothness={3} position={[-0.82, 0.1, 0.22]} rotation={[0, 0.1, 0]} castShadow>
        <meshStandardMaterial color="#232323" roughness={0.88} />
      </RoundedBox>
      <mesh position={[-1.03, 0.164, -0.31]}>
        <cylinderGeometry args={[0.055, 0.055, 0.015, 16]} />
        <meshStandardMaterial color="#3a3a37" roughness={0.9} />
      </mesh>
      <mesh position={[-0.86, 0.164, -0.31]}>
        <cylinderGeometry args={[0.055, 0.055, 0.015, 16]} />
        <meshStandardMaterial color="#3a3a37" roughness={0.9} />
      </mesh>
    </group>
  );
}

type Cutout = {
  texture: CanvasTexture;
  aspect: number; // height / width
  mask: Uint8Array; // coarse alpha map, so only the drawn pixels are clickable
  maskWidth: number;
  maskHeight: number;
};

const MASK_WIDTH = 128;

// Loads a drawing and crops it to its visible pixels, in case the PNG has a transparent margin.
async function loadCutout(src: string): Promise<Cutout> {
  const image = await new ImageLoader().loadAsync(src);
  const full = document.createElement("canvas");
  full.width = image.naturalWidth;
  full.height = image.naturalHeight;
  const fullContext = full.getContext("2d", { willReadFrequently: true })!;
  fullContext.drawImage(image, 0, 0);
  const pixels = fullContext.getImageData(0, 0, full.width, full.height).data;
  let left = full.width, top = full.height, right = -1, bottom = -1;
  for (let y = 0; y < full.height; y++) {
    for (let x = 0; x < full.width; x++) {
      if (pixels[(y * full.width + x) * 4 + 3] > 2) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }
  if (right < 0) throw new Error(`${src} is fully transparent`);

  const width = right - left + 1;
  const height = bottom - top + 1;
  const cropped = document.createElement("canvas");
  cropped.width = width;
  cropped.height = height;
  cropped.getContext("2d")!.drawImage(full, left, top, width, height, 0, 0, width, height);

  const maskHeight = Math.max(1, Math.round((MASK_WIDTH * height) / width));
  const small = document.createElement("canvas");
  small.width = MASK_WIDTH;
  small.height = maskHeight;
  const smallContext = small.getContext("2d", { willReadFrequently: true })!;
  smallContext.drawImage(cropped, 0, 0, MASK_WIDTH, maskHeight);
  const smallPixels = smallContext.getImageData(0, 0, MASK_WIDTH, maskHeight).data;
  const mask = new Uint8Array(MASK_WIDTH * maskHeight);
  for (let index = 0; index < mask.length; index++) mask[index] = smallPixels[index * 4 + 3];

  const texture = new CanvasTexture(cropped);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, aspect: height / width, mask, maskWidth: MASK_WIDTH, maskHeight };
}

// null while loading, "missing" when the image can't be used.
function useCutout(src: string) {
  const [cutout, setCutout] = useState<Cutout | "missing" | null>(null);
  useEffect(() => {
    let current = true;
    let loaded: Cutout | undefined;
    loadCutout(src).then(
      (result) => {
        loaded = result;
        if (current) setCutout(result);
        else result.texture.dispose();
      },
      () => current && setCutout("missing"),
    );
    return () => {
      current = false;
      loaded?.texture.dispose();
    };
  }, [src]);
  return cutout;
}

// One desk object: the custom drawing standing on the desk like a paper cut-out, its bottom
// edge on the desk and its face parallel to the fixed camera's view so it reads exactly as drawn.
// Falls back to the built-in 3D object if the drawing can't be loaded.
function DeskDoor({ door, fallbackPosition, fallback, onSettled }: {
  door: Door;
  fallbackPosition: [number, number, number];
  fallback: ReactNode;
  onSettled: () => void;
}) {
  const cutout = useCutout(door.asset.src);
  const camera = useThree((state) => state.camera);
  const { position, width } = door.asset;
  const height = cutout && cutout !== "missing" ? width * cutout.aspect : 0;

  // Parallel to the camera's view, so the drawing shows upright and undistorted (just scaled),
  // leaning back from its bottom edge. Also used to put the chip just above its top.
  const pivot = useMemo(() => {
    const object = new Object3D();
    object.quaternion.copy(camera.quaternion);
    return object;
  }, [camera]);
  const chipPosition = useMemo(() => {
    const top = new Vector3(0, height + 0.25, 0).applyQuaternion(pivot.quaternion);
    return [top.x, top.y, top.z] as [number, number, number];
  }, [pivot, height]);

  const settled = cutout !== null;
  useEffect(() => {
    if (settled) onSettled();
  }, [settled, onSettled]);

  if (cutout === null) return null;
  if (cutout === "missing") {
    return <InteractiveDoor door={door} position={fallbackPosition}>{fallback}</InteractiveDoor>;
  }

  // Only count hits on the drawing itself, not its transparent surroundings.
  function raycast(this: Mesh, raycaster: Raycaster, intersects: Intersection[]) {
    if (cutout === null || cutout === "missing") return;
    const hits: Intersection[] = [];
    Mesh.prototype.raycast.call(this, raycaster, hits);
    for (const hit of hits) {
      if (!hit.uv) continue;
      const x = Math.min(cutout.maskWidth - 1, Math.floor(hit.uv.x * cutout.maskWidth));
      const y = Math.min(cutout.maskHeight - 1, Math.floor((1 - hit.uv.y) * cutout.maskHeight));
      if (cutout.mask[y * cutout.maskWidth + x] > 40) intersects.push(hit);
    }
  }

  return (
    <InteractiveDoor door={door} position={position} chipPosition={chipPosition}>
      <group quaternion={pivot.quaternion}>
        <mesh position={[0, height / 2, 0]} raycast={raycast} castShadow>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={cutout.texture} transparent alphaTest={0.02} toneMapped={false} />
        </mesh>
      </group>
    </InteractiveDoor>
  );
}

// Calls onReady once every object has its drawing (or fallback), so the static still life
// underneath doesn't fade out onto a half-empty desk.
function StudioObjects({ onReady }: { onReady: () => void }) {
  const settled = useRef(new Set<number>());
  const ready = useRef(onReady);
  useEffect(() => {
    ready.current = onReady;
  }, [onReady]);
  const settle = useMemo(
    () => sceneDoors.map((_, index) => () => {
      settled.current.add(index);
      if (settled.current.size === sceneDoors.length) ready.current();
    }),
    [],
  );
  return (
    <>
      <DeskDoor door={sceneDoors[0]} fallbackPosition={[0.35, 0, -0.45]} fallback={<Laptop />} onSettled={settle[0]} />
      <DeskDoor door={sceneDoors[1]} fallbackPosition={[-2.05, 0, 0.12]} fallback={<Notebook />} onSettled={settle[1]} />
      <DeskDoor door={sceneDoors[2]} fallbackPosition={[2.25, 0, -0.8]} fallback={<MugAndPencilCup />} onSettled={settle[2]} />
      <DeskDoor door={sceneDoors[3]} fallbackPosition={[0.15, 0, 1.75]} fallback={<PhoneAndEnvelope />} onSettled={settle[3]} />
    </>
  );
}

export function StudioScene({ pixelRatio, active, onReady }: { pixelRatio: number; active: boolean; onReady: () => void }) {
  return (
    <Canvas
      dpr={pixelRatio}
      frameloop={active ? "always" : "never"}
      shadows
      camera={{ position: [0, 7.6, 9.8], fov: 38, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      aria-label="fixed-camera 3d desk still life"
    >
      {/* The canvas is transparent: the drawn background sits behind it (components/home-scene.tsx).
          This plane only catches shadows, and only over the drawn desk (in front of z = 0). */}
      <SceneLighting />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 3]} receiveShadow>
        <planeGeometry args={[14, 6]} />
        <shadowMaterial opacity={0.18} />
      </mesh>
      <ContactShadows position={[0, -0.06, 2.5]} opacity={0.22} scale={9.5} blur={2.2} far={3.5} resolution={256} />
      <StudioObjects onReady={onReady} />
    </Canvas>
  );
}
