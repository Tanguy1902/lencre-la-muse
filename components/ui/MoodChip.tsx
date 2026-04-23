interface MoodChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function MoodChip({
  label,
  isActive = false,
  onClick,
  className = "",
}: MoodChipProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 font-sans text-[12px] font-medium uppercase tracking-widest transition-colors ${
        isActive
          ? "border-primary bg-primary text-on-primary"
          : "border-outline-variant text-on-surface-variant hover:border-primary"
      } ${className}`}
    >
      {label}
    </button>
  );
}
