import { Button } from "../../../components/atoms/Button";

interface PlayButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function PlayButton({ isPlaying, onToggle }: PlayButtonProps) {
  return (
    <Button variant={isPlaying ? "secondary" : "primary"} size="lg" onClick={onToggle}>
      {isPlaying ? "Stop" : "Play"}
    </Button>
  );
}
