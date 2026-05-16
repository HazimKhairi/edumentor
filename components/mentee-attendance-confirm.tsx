"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Loader2, ShieldCheck, Video, VideoOff } from "lucide-react";
import { confirmAttendance, getSessionStatus } from "@/lib/actions";

type FaceApi = typeof import("@vladmandic/face-api");

type Session = {
  id: string;
  course: string;
  room: string;
  date: string;
  time: string;
};

type Props = {
  session: Session;
  myUserId: string;
  myMatric: string;
  myName: string;
  myDescriptor: number[] | null;
  initiallyVerified: boolean;
};

const STORAGE_KEY = "edumentor:enrolled-faces:v2";
const MATCH_THRESHOLD = 0.55;
const DETECT_INTERVAL_MS = 250;
const POLL_INTERVAL_MS = 2500;

type Stage =
  | "idle"
  | "matching"
  | "matched"
  | "confirmed"
  | "verified"
  | "no-face"
  | "mismatch"
  | "no-enrolment";

// Mentee-facing attendance confirmation:
//   step 1: mentee opens camera, face-api matches their stored descriptor
//   step 2: mentee taps "Confirm I'm here" → POST to confirmAttendance action
//   step 3: this component polls getSessionStatus until mentor flips mentorVerified
export function MenteeAttendanceConfirm({
  session,
  myUserId,
  myMatric,
  myName,
  myDescriptor,
  initiallyVerified,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const faceapiRef = useRef<FaceApi | null>(null);
  const myDescriptorRef = useRef<Float32Array | null>(null);
  const detectingRef = useRef(false);

  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">("loading");
  const [cameraStatus, setCameraStatus] = useState<"idle" | "requesting" | "live" | "denied" | "error">("idle");
  const [stage, setStage] = useState<Stage>(initiallyVerified ? "verified" : "idle");
  const [matchDistance, setMatchDistance] = useState<number | null>(null);

  // Load models
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

  // Prefer the server-stored descriptor (User.faceDescriptor BLOB), fall back
  // to localStorage for any account that registered before the DB migration.
  useEffect(() => {
    if (myDescriptor && myDescriptor.length > 0) {
      myDescriptorRef.current = new Float32Array(myDescriptor);
      return;
    }
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
        setStage("no-enrolment");
        return;
      }
      const parsed = JSON.parse(raw) as Record<string, number[]>;
      const mine = parsed[myMatric];
      if (!mine) {
        setStage("no-enrolment");
        return;
      }
      myDescriptorRef.current = new Float32Array(mine);
    } catch (e) {
      console.warn("failed to restore my face descriptor", e);
    }
  }, [myMatric, myDescriptor]);

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
      setStage("matching");
    } catch (e: unknown) {
      console.error("camera error", e);
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
    if (stage === "matching") setStage("idle");
  }, [stage]);

  // Detection loop, only runs in "matching" stage
  useEffect(() => {
    if (cameraStatus !== "live" || modelStatus !== "ready" || stage !== "matching") return;
    let cancelled = false;

    const tick = async () => {
      if (cancelled || detectingRef.current) return;
      const faceapi = faceapiRef.current;
      const video = videoRef.current;
      const mine = myDescriptorRef.current;
      if (!faceapi || !video || !mine || video.readyState < 2) return;

      detectingRef.current = true;
      try {
        const det = await faceapi
          .detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }),
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (cancelled) return;
        if (!det) {
          setStage("no-face");
          return;
        }

        const dist = faceapi.euclideanDistance(det.descriptor, mine);
        setMatchDistance(dist);
        if (dist < MATCH_THRESHOLD) {
          // Stop the camera inline once we have a match, the mentee just needs
          // to tap Confirm next. Keeping camera-stop here avoids a render-driven
          // effect that would re-trigger this loop.
          const stream = video.srcObject as MediaStream | null;
          stream?.getTracks().forEach((t) => t.stop());
          video.srcObject = null;
          setCameraStatus("idle");
          setStage("matched");
        } else {
          setStage("mismatch");
        }
      } catch (e) {
        console.warn("detect failed", e);
      } finally {
        detectingRef.current = false;
      }
    };

    const interval = window.setInterval(tick, DETECT_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [cameraStatus, modelStatus, stage]);

  const confirm = useCallback(async () => {
    setStage("confirmed");
    try {
      await confirmAttendance(session.id);
    } catch (e) {
      console.error("confirm failed", e);
      setStage("matched");
    }
  }, [session.id]);

  // Once confirmed, poll the server until the mentor flips mentorVerified.
  useEffect(() => {
    if (stage !== "confirmed") return;
    let cancelled = false;
    const tick = async () => {
      try {
        const rows = await getSessionStatus(session.id);
        if (cancelled) return;
        const mine = rows.find((r) => r.menteeId === myUserId);
        if (mine?.mentorVerified) setStage("verified");
      } catch (e) {
        console.warn("status poll failed", e);
      }
    };
    void tick();
    const id = window.setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [stage, session.id, myUserId]);

  return (
    <section>
      <div className="mx-auto max-w-[800px] px-6 py-8">
        <div className="card p-5 md:p-6">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
            <div>
              <h2 className="font-semibold text-base">{session.course}, {session.room}</h2>
              <p className="text-xs text-ink-muted mt-0.5 tabular">
                {session.date}, {session.time}
              </p>
            </div>
            <div className="text-xs text-ink-muted">
              Signed in as <span className="font-semibold text-ink">{myName}</span>
            </div>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5 text-xs">
            <li
              className={`rounded-md border px-3 py-2 ${
                stage === "matched" || stage === "confirmed" || stage === "verified"
                  ? "border-fern/40 bg-fern/10"
                  : "border-rule bg-paper-dark/30"
              }`}
            >
              <div className="text-[10px] uppercase tracking-wide text-ink-muted">Step 1</div>
              <div className="font-semibold">Face match</div>
              <div className="text-ink-muted mt-0.5">Camera confirms it is you.</div>
            </li>
            <li
              className={`rounded-md border px-3 py-2 ${
                stage === "confirmed" || stage === "verified"
                  ? "border-fern/40 bg-fern/10"
                  : "border-rule bg-paper-dark/30"
              }`}
            >
              <div className="text-[10px] uppercase tracking-wide text-ink-muted">Step 2</div>
              <div className="font-semibold">You confirm</div>
              <div className="text-ink-muted mt-0.5">Tap to record your attendance.</div>
            </li>
            <li
              className={`rounded-md border px-3 py-2 ${
                stage === "verified"
                  ? "border-fern/40 bg-fern/10"
                  : "border-rule bg-paper-dark/30"
              }`}
            >
              <div className="text-[10px] uppercase tracking-wide text-ink-muted">Step 3</div>
              <div className="font-semibold">Mentor verifies</div>
              <div className="text-ink-muted mt-0.5">Locked on the mentor roster.</div>
            </li>
          </ol>

          <div className="relative aspect-[16/9] bg-black flex items-center justify-center overflow-hidden rounded-md mb-4">
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            {cameraStatus !== "live" && stage !== "matched" && stage !== "confirmed" && stage !== "verified" ? (
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
                    : "Tap Start camera to begin the face check."}
                </p>
              </div>
            ) : null}

            {stage === "matched" || stage === "confirmed" || stage === "verified" ? (
              <div className="relative z-10 text-center text-bone px-6">
                <CheckCircle2 size={48} className="mx-auto mb-2 text-fern" />
                <p className="text-sm font-semibold">Face matched</p>
                {matchDistance !== null ? (
                  <p className="text-xs text-bone/60 mt-1 tabular">
                    distance {matchDistance.toFixed(2)}, threshold {MATCH_THRESHOLD}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {stage === "no-enrolment" ? (
              <p className="text-sm text-oxblood">
                Your face was never captured.{" "}
                <a
                  href="/profile/face"
                  className="font-semibold underline hover:text-oxblood-deep"
                >
                  Capture it now
                </a>
                , or ask your mentor to enrol you from the roster.
              </p>
            ) : stage === "verified" ? (
              <div className="flex items-center gap-2 text-sm text-fern font-semibold">
                <ShieldCheck size={16} />
                Attendance recorded and verified by the mentor.
              </div>
            ) : stage === "confirmed" ? (
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Loader2 size={14} className="animate-spin" />
                Waiting for the mentor to verify on their roster.
              </div>
            ) : stage === "matched" ? (
              <button type="button" onClick={confirm} className="btn btn-primary">
                <CheckCircle2 size={16} /> Confirm I am here
              </button>
            ) : cameraStatus !== "live" ? (
              <button
                type="button"
                onClick={startCamera}
                disabled={modelStatus !== "ready" || cameraStatus === "requesting"}
                className="btn btn-primary"
              >
                <Camera size={16} /> Start camera
              </button>
            ) : (
              <button type="button" onClick={stopCamera} className="btn btn-ghost">
                <VideoOff size={16} /> Stop camera
              </button>
            )}

            {modelStatus === "loading" ? (
              <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
                <Loader2 size={12} className="animate-spin" /> Loading recognition models
              </span>
            ) : null}
            {stage === "mismatch" ? (
              <span className="text-xs text-oxblood">
                Face does not match this account, try again or contact your mentor.
              </span>
            ) : null}
            {stage === "no-face" && cameraStatus === "live" ? (
              <span className="text-xs text-ink-muted">
                No face detected, position yourself in the frame.
              </span>
            ) : null}
          </div>

          <p className="text-xs text-ink-muted mt-4 leading-relaxed">
            Step 1 happens on this device (face-api in the browser). Step 2 is your tap.
            Step 3 happens when your mentor opens their roster and locks the record.
            Both signatures must be present for this session to count.
          </p>
        </div>
      </div>
    </section>
  );
}
