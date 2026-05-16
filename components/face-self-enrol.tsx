"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Loader2, ScanFace, Video, VideoOff } from "lucide-react";
import { enrolMyFace } from "@/lib/actions";

type FaceApi = typeof import("@vladmandic/face-api");

const STORAGE_KEY = "edumentor:enrolled-faces:v2";

export function FaceSelfEnrol({
  matric,
  alreadyEnrolled,
}: {
  matric: string;
  alreadyEnrolled: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceapiRef = useRef<FaceApi | null>(null);
  const detectingRef = useRef(false);

  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">("loading");
  const [cameraStatus, setCameraStatus] = useState<
    "idle" | "requesting" | "live" | "denied" | "error"
  >("idle");
  const [faceCount, setFaceCount] = useState(0);
  const [descriptor, setDescriptor] = useState<number[] | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Load face-api models once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const faceapi = await import("@vladmandic/face-api");
        if (cancelled) return;
        const url = "/face-models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(url);
        await faceapi.nets.faceLandmark68Net.loadFromUri(url);
        await faceapi.nets.faceRecognitionNet.loadFromUri(url);
        if (cancelled) return;
        faceapiRef.current = faceapi;
        setModelStatus("ready");
      } catch (e) {
        console.error("face-api model load failed", e);
        if (!cancelled) setModelStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const startCamera = useCallback(async () => {
    setCameraStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 720, height: 480, facingMode: "user" },
        audio: false,
      });
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setCameraStatus("live");
    } catch (e: unknown) {
      const name = (e as { name?: string })?.name;
      setCameraStatus(name === "NotAllowedError" ? "denied" : "error");
    }
  }, []);

  const stopCamera = useCallback(() => {
    const video = videoRef.current;
    const stream = video?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (video) video.srcObject = null;
    // The detection loop paints bounding boxes on the canvas every tick.
    // Wipe it on stop so the last-frame rectangle does not linger.
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setCameraStatus("idle");
    setFaceCount(0);
  }, []);

  // Bounding-box detection loop, just to give visual feedback
  useEffect(() => {
    if (cameraStatus !== "live" || modelStatus !== "ready") return;
    let cancelled = false;
    const tick = async () => {
      if (cancelled || detectingRef.current) return;
      const faceapi = faceapiRef.current;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!faceapi || !video || !canvas || video.readyState < 2) return;
      detectingRef.current = true;
      try {
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }),
        );
        if (cancelled) return;
        setFaceCount(detections.length);
        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const det of detections) {
          const { x, y, width, height } = det.box;
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#15803d";
          ctx.strokeRect(x, y, width, height);
        }
      } finally {
        detectingRef.current = false;
      }
    };
    const interval = window.setInterval(tick, 250);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [cameraStatus, modelStatus]);

  const capture = useCallback(async () => {
    const faceapi = faceapiRef.current;
    const video = videoRef.current;
    if (!faceapi || !video || cameraStatus !== "live") return;
    setCapturing(true);
    try {
      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.55 }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!detection) {
        setStatus("No face detected, position yourself in the frame.");
        return;
      }
      const arr = Array.from(detection.descriptor);
      setDescriptor(arr);
      // Mirror to localStorage too so the on-device fallback works.
      if (typeof window !== "undefined" && matric) {
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          const map = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
          map[matric] = arr;
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
        } catch {
          // ignore
        }
      }
      setStatus("Face captured. Click Save to bind it to your account.");
      stopCamera();
    } catch (e) {
      console.error("capture failed", e);
      setStatus("Capture failed, try again.");
    } finally {
      setCapturing(false);
    }
  }, [cameraStatus, matric, stopCamera]);

  return (
    <div className="space-y-4">
      {alreadyEnrolled && !descriptor ? (
        <div className="rounded-md border border-fern/40 bg-fern/10 px-3 py-2 text-sm text-fern">
          Your face is already on record. Re-capturing will replace it.
        </div>
      ) : null}

      <form action={enrolMyFace}>
        <input
          type="hidden"
          name="faceDescriptor"
          value={descriptor ? JSON.stringify(descriptor) : ""}
        />

        <div className="card p-0 overflow-hidden mb-4">
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
            {cameraStatus !== "live" && !descriptor ? (
              <div className="relative z-10 text-center text-bone/85 px-6">
                <Video size={40} className="mx-auto mb-3 opacity-80" />
                <p className="text-sm font-semibold">
                  {cameraStatus === "denied"
                    ? "Camera permission denied"
                    : cameraStatus === "error"
                      ? "Camera unavailable"
                      : cameraStatus === "requesting"
                        ? "Requesting camera"
                        : "Camera off"}
                </p>
                <p className="text-xs text-bone/60 mt-1">
                  {cameraStatus === "denied"
                    ? "Allow camera access in your browser settings, then retry."
                    : "Click Start camera to begin."}
                </p>
              </div>
            ) : null}
            {descriptor ? (
              <div className="relative z-10 text-center text-bone px-6">
                <CheckCircle2 size={48} className="mx-auto mb-2 text-fern" />
                <p className="text-sm font-semibold">Face captured</p>
                <p className="text-xs text-bone/60 mt-1 tabular">
                  {descriptor.length} numbers stored, ready to save
                </p>
              </div>
            ) : null}
            {cameraStatus === "live" && !descriptor ? (
              <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-bone/95 px-2.5 py-1 rounded-sm text-xs font-semibold">
                <span className="size-1.5 rounded-full bg-oxblood blink" />
                {faceCount} face{faceCount === 1 ? "" : "s"} on screen
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {descriptor ? (
            <>
              <button type="submit" className="btn btn-primary">
                <ScanFace size={16} /> Save to my account
              </button>
              <button
                type="button"
                onClick={() => {
                  setDescriptor(null);
                  setStatus(null);
                }}
                className="btn btn-ghost btn-sm"
              >
                Discard, capture again
              </button>
            </>
          ) : cameraStatus !== "live" ? (
            <button
              type="button"
              onClick={startCamera}
              disabled={modelStatus !== "ready" || cameraStatus === "requesting"}
              className="btn btn-primary"
            >
              {modelStatus === "loading" ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Loading models
                </>
              ) : cameraStatus === "requesting" ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Starting camera
                </>
              ) : (
                <>
                  <Camera size={14} /> Start camera
                </>
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={capture}
                disabled={capturing || faceCount === 0}
                className="btn btn-primary"
              >
                {capturing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ScanFace size={14} />
                )}
                Capture face
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="btn btn-ghost btn-sm"
              >
                <VideoOff size={14} /> Cancel
              </button>
            </>
          )}
          {status ? (
            <span className="text-xs text-ink-soft">{status}</span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
