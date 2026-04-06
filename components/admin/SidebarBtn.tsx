"use client";

interface SidebarBtnProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
}

/**
 * Icon-only sidebar navigation button.
 * Shows an active indicator line on the right edge when selected.
 */
export default function SidebarBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: SidebarBtnProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
        active
          ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
          : "text-white/40 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-5 h-5" />
      {active && (
        <div className="absolute -right-[21px] top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-500 rounded-l-full" />
      )}
    </button>
  );
}
