import AnimatedCounter from "./AnimatedCounter";
import CampaignRequestForm from "./CampaignRequestForm";
import { Sparkles } from "lucide-react";

export default function CampaignRequestSection() {
  return (
    <section
      id="campaign-request"
      className="relative py-24 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* ── Left column: Info ── */}
          <div className="lg:sticky lg:top-32">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <AnimatedCounter
                target={123368726519}
                duration={2500}
                suffix=" views generated so far!"
                className="tabular-nums"
              />
            </div>

            {/* Headline */}
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Start your first campaign{" "}
              <span className="gradient-text">within hours.</span>
            </h2>

            {/* Steps */}
            <div className="mt-10 space-y-8">
              <StepItem
                number={1}
                title="Fill out the form"
                desc="Takes 1 minute and gives us everything we need to understand your goals."
              />
              <StepItem
                number={2}
                title="Get onboarded"
                desc="Our team reviews your brief and reaches out with clear next steps to set up your campaign."
              />
              <StepItem
                number={3}
                title="Go live"
                desc="Your campaign launches immediately after and you only pay for verified results."
              />
            </div>
          </div>

          {/* ── Right column: Form ── */}
          <div className="bg-[#0f0d24]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-violet-500/5">
            <CampaignRequestForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function StepItem({
  number,
  title,
  desc,
}: {
  number: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-violet-500/20">
        {number}
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/45 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
