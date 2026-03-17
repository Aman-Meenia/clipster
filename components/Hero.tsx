import AnimatedCounter from "./AnimatedCounter";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Aurora Background Orbs */}
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-center">
        {/* Stats Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cosmic-violet/30 bg-cosmic-violet/10 px-5 py-2 text-sm font-medium text-cosmic-purple animate-border-glow">
          <Sparkles className="h-4 w-4" />
          <AnimatedCounter
            target={113794054853}
            duration={2500}
            suffix=" views generated"
            className="tabular-nums"
          />
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Turn Your Content Into{" "}
          <span className="gradient-text">Real Earnings</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50 sm:text-xl">
          Join 60K+ creators and explore campaigns from 200+ brands.
          Get paid for every verified view your short-form content generates.
        </p>

        {/* Earnings highlight */}
        <div className="mt-8 flex items-center justify-center gap-2 text-lg font-semibold">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <span className="text-emerald-400">Creators have earned</span>
          <AnimatedCounter
            target={3800000}
            duration={2000}
            prefix="$"
            suffix="+"
            className="gradient-text-warm text-2xl font-bold tabular-nums"
          />
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="#campaigns"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-cosmic-violet to-cosmic-blue px-8 py-4 text-base font-semibold text-white shadow-xl shadow-cosmic-violet/20 transition-all hover:shadow-2xl hover:shadow-cosmic-violet/30 hover:scale-[1.02]"
          >
            Start Earning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Launch Your Campaign
          </Link>
        </div>
      </div>
    </section>
  );
}
