type TherapistBadgeProps = {
  compact?: boolean;
};

export function TherapistBadge({ compact }: TherapistBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-emerald-600/70 bg-emerald-50 px-2 ${
        compact ? "py-0.5 text-[11px]" : "py-1 text-xs"
      } font-medium text-emerald-700`}
    >
      <svg
        aria-hidden="true"
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          className="stroke-emerald-600"
          strokeWidth="1.5"
        />
        <path
          d="M9 12.75l2 2.25 4-4.5"
          className="stroke-emerald-600"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Therapist</span>
    </span>
  );
}
