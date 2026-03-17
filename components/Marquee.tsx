const campaigns = [
  "Clipster.gg [UGC]",
  "OneState [CLIPPING]",
  "klepto [EDITS]",
  "Yeat × EsDeeKid [EDITS]",
  "Plutus.gg [CLIPPING]",
  "Love Letter [EDITS]",
  "Hermeneutics [GYM]",
  "Shark Business [EDITS]",
  "Jessie Ware [CLIPPING]",
  "Kian Hoss [ROUND 3]",
  "Dubbing AI [GAMING]",
  "ScratchAdventure [CLIPPING]",
  "NoLimitCity [GAMBA]",
  "B.Site [CS2]",
  "Acebet [LIVESTREAM]",
  "Bitz.io [GENERAL]",
  "Betstrike [GAMING]",
  "Betstrike [SPORTS]",
];

export default function Marquee() {
  // Duplicate for seamless loop
  const items = [...campaigns, ...campaigns];

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-cosmic-surface/50 py-5">
      {/* Gradient Fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-cosmic-deep to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-cosmic-deep to-transparent" />

      <div
        className="flex animate-marquee whitespace-nowrap"
        style={{ "--marquee-duration": "40s" } as React.CSSProperties}
      >
        {items.map((name, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-2 text-sm font-medium text-white/40 transition-colors hover:text-white/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cosmic-violet/60" />
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
