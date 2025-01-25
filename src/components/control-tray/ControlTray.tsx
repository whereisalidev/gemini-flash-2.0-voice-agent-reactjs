import cn from "classnames";
import { memo, useState, useEffect, useRef } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { AudioRecorder } from "../../lib/audio-recorder";
import AudioPulse from "../audio-pulse/AudioPulse";
import "./control-tray.scss";

export type ControlTrayProps = {
  children?: React.ReactNode;
  supportsVideo: boolean;
};

type MediaStreamButtonProps = {
  isStreaming: boolean;
  start: () => Promise<any>;
  stop: () => any;
};

/**
 * button used for triggering webcam or screen-capture
 */
const MediaStreamButton = memo(
  ({ isStreaming, start, stop }: MediaStreamButtonProps) =>
    isStreaming ? (
      <button className="action-button" onClick={stop}>
        End Call
      </button>
    ) : (
      <button className="action-button" onClick={start}>
        Start a Call
      </button>
    ),
);

function ControlTray({ supportsVideo }: ControlTrayProps) {
  const [inVolume, setInVolume] = useState(0);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectButtonRef = useRef<HTMLButtonElement>(null);

  const { client, connected, connect, disconnect, volume } =
    useLiveAPIContext();

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--volume",
      `${Math.max(5, Math.min(inVolume * 200, 8))}px`,
    );
  }, [inVolume]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([{
        mimeType: "audio/pcm;rate=16000",
        data: base64,
      }]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on("data", onData).on("volume", setInVolume).start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off("data", onData).off("volume", setInVolume);
    };
  }, [connected, client, muted, audioRecorder]);

  return (
    <section className="control-tray">
      <nav className={cn("actions-nav", { disabled: !connected })}>
        <button
          className={cn("action-button mic-button")}
          onClick={() => setMuted(!muted)}
        >
          {!muted ? (
            <span className="material-symbols-outlined filled">mic</span>
          ) : (
            <span className="material-symbols-outlined filled">mic_off</span>
          )}
        </button>

        {/* <div className="action-button no-action outlined">
          <AudioPulse volume={volume} active={connected} hover={false} />
        </div> */}

        {supportsVideo && (
          <>
            {/* Removed video-related buttons and handlers */}
          </>
        )}
      </nav>

      <div className={cn("connection-container", { connected })}>
        <div className="connection-button-container">
          <MediaStreamButton
            isStreaming={connected}
            start={connect}
            stop={disconnect}
          />
        </div>
        <span className="text-indicator">Streaming</span>
      </div>
    </section>
  );
}

export default memo(ControlTray);
