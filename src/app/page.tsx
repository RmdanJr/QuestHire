import Link from "next/link";

export default function Home() {
  return (
    <main id="main" className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* Decorative fog layers: hidden from assistive tech, still under reduced motion */}
      <div aria-hidden="true" className="fog pointer-events-none absolute inset-x-0 top-1/3 h-48 bg-gradient-to-r from-transparent via-rune/10 to-transparent blur-2xl" />
      <div aria-hidden="true" className="fog pointer-events-none absolute inset-x-0 bottom-10 h-40 bg-gradient-to-r from-transparent via-ghost/10 to-transparent blur-2xl [animation-delay:-10s]" />

      <p className="relative mb-4 font-display text-sm uppercase tracking-[0.3em] text-ghost">
        Interview prep, but haunted
      </p>
      <h1 className="relative max-w-3xl text-5xl font-bold leading-tight text-candle sm:text-6xl">
        The Crypt of the Hiring Manager
      </h1>
      <p className="relative mt-6 max-w-2xl text-lg text-parchment">
        Got an interview in six days? QuestHire turns your invite, resume and job
        description into a quest. Fight your way through the topics that matter,
        room by room, until the real interviewer is the final boss.
      </p>

      <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/gallery"
          className="inline-flex items-center justify-center rounded-md bg-candle px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-void transition-colors hover:bg-ember"
        >
          Enter the library
        </Link>
        <a
          href="https://github.com/RmdanJr/QuestHire"
          className="inline-flex items-center justify-center rounded-md border border-crypt-border px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-parchment transition-colors hover:bg-crypt-raised"
        >
          View the source
        </a>
      </div>

      <ul className="relative mt-16 grid max-w-3xl gap-6 text-left sm:grid-cols-3">
        {[
          ["Candles", "Your hit points. Wrong answers snuff them out."],
          ["Hourglass", "The days left until the real interview."],
          ["Moon", "Your readiness, from new moon to full."],
        ].map(([name, text]) => (
          <li key={name} className="rounded-lg border border-crypt-border bg-crypt p-4">
            <h2 className="font-display text-base font-semibold text-candle">{name}</h2>
            <p className="mt-1 text-sm text-parchment-dim">{text}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
