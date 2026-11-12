"use client";

import { useState } from "react";
import {
  CandleHp,
  GrimoirePanel,
  Hourglass,
  MoonMeter,
  RuneButton,
  ScrollModal,
} from "@/components/ui";

export function GalleryClient() {
  const [hp, setHp] = useState(5);
  const [readiness, setReadiness] = useState(35);
  const [open, setOpen] = useState(false);

  return (
    <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-4xl font-bold text-candle">Component gallery</h1>
      <p className="mt-2 text-parchment-dim">
        The Haunted Library kit. Every spooky element has a job.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <GrimoirePanel title="Candle HP">
          <CandleHp current={hp} max={5} label="Your hit points" />
          <div className="mt-4 flex gap-3">
            <RuneButton variant="danger" onClick={() => setHp((v) => Math.max(0, v - 1))}>
              Wrong answer
            </RuneButton>
            <RuneButton variant="ghost" onClick={() => setHp(5)}>
              Relight
            </RuneButton>
          </div>
        </GrimoirePanel>

        <GrimoirePanel title="Moon meter">
          <MoonMeter value={readiness} label="Readiness" />
          <div className="mt-4 flex gap-3">
            <RuneButton onClick={() => setReadiness((v) => Math.min(100, v + 15))}>
              Clear a room
            </RuneButton>
            <RuneButton variant="ghost" onClick={() => setReadiness(0)}>
              Reset
            </RuneButton>
          </div>
        </GrimoirePanel>

        <GrimoirePanel title="Hourglass">
          <Hourglass daysLeft={6} totalDays={14} />
        </GrimoirePanel>

        <GrimoirePanel
          title="Lore scroll"
          footer="Scrolls are read with the Archivist. Press Escape to close."
        >
          <p className="mb-4">Open a scroll to see the modal with its focus trap.</p>
          <RuneButton onClick={() => setOpen(true)}>Unroll scroll</RuneButton>
        </GrimoirePanel>
      </div>

      <ScrollModal
        open={open}
        onClose={() => setOpen(false)}
        title="Caching, in one scroll"
        footer="Adapted lore appears here with attribution."
      >
        <p>
          A cache trades freshness for speed. Decide what may go stale, for how
          long, and who pays when it does.
        </p>
      </ScrollModal>
    </main>
  );
}
