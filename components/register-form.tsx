"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Loader2,
  ScanFace,
  Video,
  VideoOff,
} from "lucide-react";
import { ROLES } from "@/lib/data";

type FaceApi = typeof import("@vladmandic/face-api");

const STORAGE_KEY = "edumentor:enrolled-faces:v2";

export function RegisterForm() {
  const [matric, setMatric] = useState("");
  const [faceCaptured, setFaceCaptured] = useState(false);

  return (
    <form className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          Full name
        </label>
        <input
          type="text"
          placeholder="Aiman Hakimi"
          className="input"
          autoComplete="name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          UiTM email
        </label>
        <input
          type="email"
          placeholder="2023607832@student.uitm.edu.my"
          className="input"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          Matric number
        </label>
        <input
          type="text"
          value={matric}
          onChange={(e) => setMatric(e.target.value)}
          placeholder="2023607832"
          className="input"
          autoComplete="username"
        />
        <p className="text-xs text-ink-muted mt-1.5">
          Both mentee and mentor sign up with their UiTM matric number.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          Password
        </label>
        <input
          type="password"
          placeholder="Choose a strong password"
          className="input"
          autoComplete="new-password"
        />
        <p className="text-xs text-ink-muted mt-1.5">
          Minimum 10 characters with one number.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          I am signing up as
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.filter((r) => r.key !== "Admin").map((r) => (
            <label
              key={r.key}
              className="relative flex flex-col items-center gap-1 p-3 rounded-md border border-rule cursor-pointer hover:border-ink has-[:checked]:border-oxblood has-[:checked]:bg-oxblood/[0.04] transition-colors"
            >
              <input
                type="radio"
                name="role"
                value={r.key}
                defaultChecked={r.key === "Mentee"}
                className="sr-only"
              />
              <span className="text-xs text-ink-muted font-semibold">
                {r.abbr}
              </span>
              <span className="text-sm font-medium">{r.key}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-ink-muted mt-2">
          Mentor applications need CGPA proof. Admin (lecturer) accounts are
          issued internally by the registrar and cannot self-register.
        </p>
      </div>

      <FaceCaptureStep
        matric={matric}
        captured={faceCaptured}
        onCapture={() => setFaceCaptured(true)}
        onReset={() => setFaceCaptured(false)}
      />

      <div className="rounded-md border border-rule bg-paper-dark/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-ink mb-1">
            Applying as a Mentor?
          </p>
          <p className="text-xs text-ink-muted leading-relaxed">
            Senior students with a current CGPA of{" "}
            <span className="font-semibold text-ink">3.20 or higher</span> may
            mentor a junior cohort. Fields below are reviewed by the registrar.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-5">
            <label className="block text-sm font-medium text-ink mb-1.5">
              Current CGPA
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              placeholder="3.74"
              className="input"
            />
            <p className="text-xs text-ink-muted mt-1.5">Out of 4.00.</p>
          </div>
          <div className="col-span-12 sm:col-span-7">
            <label className="block text-sm font-medium text-ink mb-1.5">
              Latest semester
            </label>
            <select className="input">
              <option>Semester 02 / 2026</option>
              <option>Semester 01 / 2026</option>
              <option>Semester 02 / 2025</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Latest transcript
          </label>
          <div className="border-2 border-dashed border-rule rounded-md p-4 text-center bg-bone">
            <p className="text-sm text-ink-muted mb-2">
              Upload your latest UiTM transcript (PDF).
            </p>
            <button type="button" className="btn btn-ghost btn-sm">
              Browse files
            </button>
            <p className="text-xs text-ink-muted mt-2">PDF only, up to 5 MB</p>
          </div>
        </div>

        <p className="text-xs text-ink-muted">
          Applications below 3.20 will be declined automatically. Decisions are
          emailed within one academic day.
        </p>
      </div>

      <label className="flex items-start gap-2 text-sm text-ink-soft cursor-pointer">
        <input type="checkbox" className="size-4 mt-0.5 accent-oxblood" />
        <span>
          I agree to the{" "}
          <Link href="#" className="text-oxblood font-medium">
            terms of use
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-oxblood font-medium">
            privacy policy
          </Link>
          .
        </span>
      </label>

      <Link href="/login" className="btn btn-primary btn-lg w-full">
        Create account
      </Link>
    </form>
  );
}

function FaceCaptureStep({
  matric,
  captured,
  onCapture,
  onReset,
}: {
  matric: string;
  captured: boolean;
  onCapture: () => void;
  onReset: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceapiRef = useRef<FaceApi | null>(null);
  const detectingRef = useRef(false);

  const [modelStatus, setModelStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [cameraStatus, setCameraStatus] = useState<
    "idle" | "requesting" | "live" | "denied" | "error"
  >("idle");
  const [faceCount, setFaceCount] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Check if matric is already enrolled in this browser
  useEffect(() => {
    if (typeof window === "undefined" || !matric.trim()) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const map = JSON.parse(raw) as Record<string, number[]>;
      if (map[matric.trim()]) {
        onCapture();
      }
    } catch {
      // ignore
    }
    // intentionally only react to matric changes; onCapture is stable enough for the demo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matric]);

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
        video: { width: 480, height: 360, facingMode: "user" },
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
    setCameraStatus("idle");
    setFaceCount(0);
  }, []);

  // Detection loop just to draw bounding box and count faces (not capturing)
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
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.5,
          }),
        );
        if (cancelled) return;
        setFaceCount(detections.length);

        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
        if (canvas.height !== video.videoHeight)
          canvas.height = video.videoHeight;
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
    if (!matric.trim()) {
      setStatusMessage("Enter your matric number above first.");
      window.setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    setCapturing(true);
    try {
      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.55,
          }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!detection) {
        setStatusMessage("No face detected, look into the camera and retry.");
        return;
      }
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
      map[matric.trim()] = Array.from(detection.descriptor);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      onCapture();
      setStatusMessage("Face captured and bound to your matric.");
      stopCamera();
    } catch (e) {
      console.error("capture failed", e);
      setStatusMessage("Capture failed, try again.");
    } finally {
      setCapturing(false);
      window.setTimeout(() => setStatusMessage(null), 4000);
    }
  }, [cameraStatus, matric, onCapture, stopCamera]);

  const handleReset = () => {
    if (typeof window !== "undefined" && matric.trim()) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const map = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
        delete map[matric.trim()];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      } catch {
        // ignore
      }
    }
    onReset();
  };

  return (
    <div className="rounded-md border border-rule bg-paper-dark/40 p-4 space-y-4">
      <div className="flex items-start gap-3">
        <span className="size-9 rounded-md bg-oxblood/15 text-oxblood flex items-center justify-center shrink-0">
          <ScanFace size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink mb-1">
            Face capture for attendance{" "}
            <span className="text-xs font-normal text-ink-muted">
              (KYC step)
            </span>
          </p>
          <p className="text-xs text-ink-muted leading-relaxed">
            We capture a one-time face descriptor (128 numbers, not a photo)
            bound to your matric. The classroom camera uses it to mark you
            present. Runs entirely in this browser.
          </p>
        </div>
      </div>

      {captured ? (
        <div className="card p-4 bg-fern/10 border-fern/30 flex items-center gap-3">
          <span className="size-9 rounded-full bg-fern/20 text-fern flex items-center justify-center shrink-0">
            <Check size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink">
              Face descriptor saved
            </p>
            <p className="text-xs text-ink-muted">
              Bound to matric{" "}
              <span className="tabular font-medium">
                {matric.trim() || "(none)"}
              </span>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-ghost btn-sm"
          >
            Re-capture
          </button>
        </div>
      ) : (
        <>
          <div className="card p-0 overflow-hidden">
            <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
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
              {cameraStatus !== "live" ? (
                <div className="relative z-10 text-center text-bone/85 px-4">
                  <Video size={36} className="mx-auto mb-2 opacity-80" />
                  <p className="text-sm">
                    {cameraStatus === "denied"
                      ? "Camera permission denied"
                      : cameraStatus === "error"
                        ? "Camera unavailable"
                        : cameraStatus === "requesting"
                          ? "Requesting camera"
                          : "Camera off"}
                  </p>
                </div>
              ) : (
                <div className="absolute top-2 left-2 inline-flex items-center gap-2 bg-bone/95 px-2 py-1 rounded-sm text-xs font-semibold">
                  <span className="size-1.5 rounded-full bg-oxblood blink" />
                  {faceCount} face{faceCount === 1 ? "" : "s"} detected
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {cameraStatus !== "live" ? (
              <button
                type="button"
                onClick={startCamera}
                disabled={
                  modelStatus !== "ready" || cameraStatus === "requesting"
                }
                className="btn btn-secondary btn-sm"
              >
                <Camera size={14} /> Start camera
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={capture}
                  disabled={capturing || faceCount === 0 || !matric.trim()}
                  className="btn btn-primary btn-sm"
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
                  <VideoOff size={14} /> Stop
                </button>
              </>
            )}
            {modelStatus === "loading" ? (
              <span className="text-xs text-ink-muted inline-flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" /> Loading models
              </span>
            ) : null}
            {modelStatus === "error" ? (
              <span className="text-xs text-oxblood">Model load failed</span>
            ) : null}
            {statusMessage ? (
              <span className="text-xs text-ink-soft">{statusMessage}</span>
            ) : null}
          </div>

          {!matric.trim() ? (
            <p className="text-xs text-saffron">
              Enter your matric number above before capturing.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
