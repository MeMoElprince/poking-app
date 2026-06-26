// Animated three-dot "typing…" indicator
export default function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="typing">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </span>
  );
}
