interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  action?: React.ReactNode;
}

/**
 * Centered empty-state placeholder with icon, title, description,
 * and an optional call-to-action slot.
 */
export default function EmptyState({
  icon: Icon,
  title,
  desc,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/8 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-white/20" />
      </div>
      <p className="text-base font-semibold text-white/50 mb-1">{title}</p>
      <p className="text-sm text-white/25 mb-5 max-w-xs">{desc}</p>
      {action}
    </div>
  );
}
