import { ImageCaptureScreen } from "./features/image-capture/ImageCaptureScreen";
import { PlaybackScreen } from "./features/playback/PlaybackScreen";

function App() {
  return (
    <div
      style={{
        maxWidth: "40rem",
        margin: "0 auto",
        padding: "var(--space-8) var(--space-4)",
      }}
    >
      <header
        style={{
          marginBottom: "var(--space-12)",
          paddingBottom: "var(--space-6)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-primary)",
          }}
        >
          Solfa Scanner
        </span>
      </header>

      <ImageCaptureScreen />

      <hr
        style={{
          margin: "var(--space-12) 0",
          border: "none",
          borderTop: "1px solid var(--color-border)",
        }}
      />

      <PlaybackScreen />
    </div>
  );
}

export default App;
