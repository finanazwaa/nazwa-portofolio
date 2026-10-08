import { TransitionLink } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <main className="page-shell flex flex-1 flex-col justify-center py-24">
      <p className="kicker">oops — torn page</p>
      <h1 className="display-title">page <em>not found</em></h1>
      <TransitionLink href="/" className="studio-link mt-8 text-[14px] text-muted">← studio</TransitionLink>
    </main>
  );
}
