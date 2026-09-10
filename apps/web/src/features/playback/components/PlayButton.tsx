import { Button } from "../../../components/atoms/Button";

interface PlayControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  onRestart: () => void;
}

export function PlayControls({ isPlaying, onToggle, onRestart }: PlayControlsProps) {
  return (
    <div style={{ display: "flex", gap: "var(--space-3)" }}>
      <Button variant={isPlaying ? "secondary" : "primary"} size="lg" onClick={onToggle}>
        {isPlaying ? "Stop" : "Play"}
      </Button>
      <Button variant="ghost" size="lg" onClick={onRestart}>
        Restart
      </Button>
    </div>
  );
}
