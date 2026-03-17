import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Creator Terms of Use", href: "#" },
    { label: "Brand Terms of Use", href: "#" },
    { label: "General Website Terms", href: "#" },
    { label: "Do Not Sell", href: "#" },
  ],
  Company: [
    { label: "Contact Us", href: "#" },
    { label: "Support", href: "#" },
    { label: "Jobs", href: "#" },
  ],
  Resources: [
    { label: "Campaign Rules", href: "#" },
    { label: "Creator Community", href: "#" },
    { label: "Blog", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-violet/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cosmic-violet to-cosmic-cyan">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Clip<span className="gradient-text">Verse</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/30 max-w-xs">
              The performance-based creator marketing platform. Get paid for
              every verified view your content generates.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="#"
                className="rounded-full bg-gradient-to-r from-cosmic-violet to-cosmic-blue px-5 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
              >
                Launch Campaign
              </Link>
              <Link
                href="#"
                className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold text-white/60 transition-all hover:border-white/20 hover:text-white"
              >
                Join as Creator
              </Link>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white/70 mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/30 transition-colors hover:text-white/60"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} ClipVerse. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-white/20 hover:text-white/40">
              Privacy
            </Link>
            <Link href="#" className="text-xs text-white/20 hover:text-white/40">
              Terms
            </Link>
            <Link href="#" className="text-xs text-white/20 hover:text-white/40">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
