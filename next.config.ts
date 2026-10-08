import type { NextConfig } from "next";

// The section pages were merged into the one-page home; keep old links working.
const sectionRedirects = ["about", "areas", "work", "contact"].map((section) => ({
  source: `/${section}`,
  destination: `/#${section}`,
  permanent: false,
}));

const nextConfig: NextConfig = {
  async redirects() {
    return sectionRedirects;
  },
};

export default nextConfig;
