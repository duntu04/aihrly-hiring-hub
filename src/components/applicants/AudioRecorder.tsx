import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AudioRecorder({ onRecordingComplete }: { onRecordingComplete: (base64: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onRecordingComplete(base64data);
        };

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure you have granted permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const clearRecording = () => {
    setAudioUrl(null);
    onRecordingComplete("");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (audioUrl) {
    return (
      <div className="mt-5 rounded-lg border border-border bg-surface-2/40 p-4 space-y-3">
        <audio controls src={audioUrl} className="w-full h-10" />
        <Button variant="outline" size="sm" onClick={clearRecording} className="gap-1.5 text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" /> Re-record
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-lg border border-border bg-surface-2/40 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors animate-pulse"
          >
            <Square className="h-5 w-5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Mic className="h-5 w-5" />
          </button>
        )}
        <div>
          <p className="text-sm font-medium">{isRecording ? "Recording..." : "Click to record your answer"}</p>
          <p className="text-xs text-text-muted font-mono mt-0.5">{formatTime(recordingTime)}</p>
        </div>
      </div>
    </div>
  );
}
