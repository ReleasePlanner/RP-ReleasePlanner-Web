type PhaseBarProps = {
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  label?: string;
  title?: string;
  ariaLabel?: string;
};

export default function PhaseBar({ left, top, width, height, color, label, title, ariaLabel }: PhaseBarProps) {
  return (
    <div
      className="absolute"
      style={{ left, top, width, height }}
      title={title}
      aria-label={ariaLabel}
    >
      <div className="h-full rounded-sm opacity-70 shadow-inner" style={{ backgroundColor: color }} />
      {label && (
        <div className="absolute left-1 top-1 text-[11px] text-white/95 font-medium mix-blend-luminosity truncate pr-1">
          {label}
        </div>
      )}
    </div>
  );
}


