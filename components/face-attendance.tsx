"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Info,
  Loader2,
  UserCheck,
  UserPlus,
  Video,
  VideoOff,
} from "lucide-react";

type FaceApi = typeof import("@vladmandic/face-api");

type RosterStudent = {
  id: string;
  name: string;
  matric: string;
};

type Session = {
  id: string;
  course: string;
  room: string;
  date: string;
  time: string;
  expected: number;
};

const STORAGE_KEY = "edumentor:enrolled-faces:v2";
const MATCH_THRESHOLD = 0.55;
const DETECT_INTERVAL_MS = 250;

export function FaceAttendance({
  roster,
  session,
}: {
  roster: RosterStudent[];
  session: Session;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceapiRef = useRef<FaceApi | null>(null);
  // Descriptors are keyed by matric so this storage is shared with the
  // register page (face capture happens at signup, KYC-style).
  const enrolledRef = useRef<Record<string, Float32Array>>({});
  const detectingRef = useRef(false);

  const [modelStatus, setModelStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [cameraStatus, setCameraStatus] = useState<
    "idle" | "requesting" | "live" | "denied" | "error"
  >("idle");
  const [enrolledMatrics, setEnrolledMatrics] = useState<Set<string>>(
    new Set(),
  );
  const [presentMatrics, setPresentMatrics] = useState<Set<string>>(new Set());
  const [detectedFaceCount, setDetectedFaceCount] = useState(0);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load face-api models once on mount
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

  // Restore enrolled descriptors from localStorage (shared with register form)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, number[]>;
      const map: Record<string, Float32Array> = {};
      for (const [matric, arr] of Object.entries(parsed)) {
        map[matric] = new Float32Array(arr);
      }
      enrolledRef.current = map;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage; SSR cannot access it during render
      setEnrolledMatrics(new Set(Object.keys(map)));
    } catch (e) {
      console.warn("failed to restore enrolled faces", e);
    }
  }, []);

  const persistEnrolled = useCallback(() => {
    if (typeof window === "undefined") return;
    const obj: Record<string, number[]> = {};
    for (const [matric, d] of Object.entries(enrolledRef.current)) {
      obj[matric] = Array.from(d);
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
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
    setDetectedFaceCount(0);
  }, []);

  // Detection loop runs while camera is live and models are ready
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
        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 320,
              scoreThreshold: 0.5,
            }),
          )
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (cancelled) return;
        setDetectedFaceCount(detections.length);

        const w = video.videoWidth;
        const h = video.videoHeight;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const enrolledEntries = Object.entries(enrolledRef.current);
        const matchedThisFrame = new Set<string>();

        for (const det of detections) {
          let bestMatric: string | null = null;
          let bestDist = Infinity;
          for (const [matric, desc] of enrolledEntries) {
            const dist = faceapi.euclideanDistance(det.descriptor, desc);
            if (dist < bestDist) {
              bestDist = dist;
              bestMatric = matric;
            }
          }
          const matched = bestMatric !== null && bestDist < MATCH_THRESHOLD;
          const student = matched
            ? roster.find((r) => r.matric === bestMatric)
            : null;
          if (matched && bestMatric) matchedThisFrame.add(bestMatric);

          const { x, y, width, height } = det.detection.box;
          ctx.lineWidth = 3;
          ctx.strokeStyle = matched ? "#15803d" : "#b91c1c";
          ctx.strokeRect(x, y, width, height);

          const label = student?.name ?? (matched ? "Enrolled (off-roster)" : "Unknown");
          const sub = matched
            ? `${bestMatric}, dist ${bestDist.toFixed(2)}`
            : "Not enrolled";
          ctx.font = "600 14px sans-serif";
          const padding = 6;
          const labelWidth =
            Math.max(
              ctx.measureText(label).width,
              ctx.measureText(sub).width,
            ) + padding * 2;
          ctx.fillStyle = matched ? "#15803d" : "#b91c1c";
          ctx.fillRect(x, y - 36, labelWidth, 32);
          ctx.fillStyle = "#fff";
          ctx.fillText(label, x + padding, y - 22);
          ctx.font = "12px sans-serif";
          ctx.fillText(sub, x + padding, y - 8);
        }

        if (matchedThisFrame.size > 0) {
          setPresentMatrics((prev) => {
            let changed = false;
            const next = new Set(prev);
            for (const matric of matchedThisFrame) {
              if (!next.has(matric)) {
                next.add(matric);
                changed = true;
              }
            }
            return changed ? next : prev;
          });
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
  }, [cameraStatus, modelStatus, roster]);

  const enrollStudent = useCallback(
    async (studentId: string) => {
      const faceapi = faceapiRef.current;
      const video = videoRef.current;
      const student = roster.find((r) => r.id === studentId);
      if (!faceapi || !video || cameraStatus !== "live" || !student) {
        setStatusMessage("Start the camera first.");
        window.setTimeout(() => setStatusMessage(null), 3000);
        return;
      }
      setEnrolling(studentId);
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
          setStatusMessage(
            "No face detected, ask the student to face the camera and try again.",
          );
          return;
        }
        enrolledRef.current = {
          ...enrolledRef.current,
          [student.matric]: detection.descriptor,
        };
        persistEnrolled();
        setEnrolledMatrics((prev) => new Set(prev).add(student.matric));
        setStatusMessage(`Enrolled ${student.name} (${student.matric}).`);
      } catch (e) {
        console.error("enroll failed", e);
        setStatusMessage("Enrolment failed, try again.");
      } finally {
        setEnrolling(null);
        window.setTimeout(() => setStatusMessage(null), 4000);
      }
    },
    [cameraStatus, persistEnrolled, roster],
  );

  const clearEnrolment = useCallback(() => {
    enrolledRef.current = {};
    setEnrolledMatrics(new Set());
    setPresentMatrics(new Set());
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const presentCount = presentMatrics.size;
  const enrolledCount = enrolledMatrics.size;

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="badge badge-oxblood">
              <span className="size-1.5 rounded-full bg-oxblood blink mr-1" /> Live now
            </span>
            <h2 className="font-semibold text-lg">
              {session.course} | {session.room}
            </h2>
          </div>

          <div className="card p-4 mb-4 bg-oxblood/[0.04] border-oxblood/20 flex items-start gap-3">
            <span className="size-8 rounded-full bg-oxblood/15 text-oxblood flex items-center justify-center shrink-0">
              <Info size={16} />
            </span>
            <div className="text-sm">
              <p className="font-semibold text-ink mb-1">
                Browser-only face recognition
              </p>
              <p className="text-ink-muted leading-relaxed">
                Powered by face-api.js. Students capture their face once at
                registration (KYC-style); the camera here matches every face
                on screen against those descriptors and marks recognised
                students{" "}
                <span className="font-semibold text-fern">Present</span>{" "}
                automatically. Use the per-student button below for fallback
                re-enrolment if a face was never captured. Nothing leaves
                the browser.
              </p>
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-rule bg-paper-dark/40">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-oxblood">
                <Camera size={16} aria-hidden /> Camera 01 | {session.room}
              </span>
              <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
                {modelStatus === "loading" ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Loading models
                  </>
                ) : modelStatus === "ready" ? (
                  <>
                    <span className="size-1.5 rounded-full bg-fern" /> Models ready
                  </>
                ) : modelStatus === "error" ? (
                  <span className="text-oxblood">Model load failed</span>
                ) : null}
              </span>
            </div>

            <div className="relative aspect-[16/9] bg-black flex items-center justify-center overflow-hidden">
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
                <div className="relative z-10 text-center text-bone/85 px-6">
                  <Video size={48} className="mx-auto mb-3 opacity-80" />
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
                      : 'Click "Start camera" to begin face recognition.'}
                  </p>
                </div>
              ) : null}

              {cameraStatus === "live" ? (
                <>
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-bone/95 px-2.5 py-1 rounded-sm text-xs font-semibold">
                    <span className="size-1.5 rounded-full bg-oxblood blink" />
                    {detectedFaceCount} face
                    {detectedFaceCount === 1 ? "" : "s"} on screen
                  </div>
                  <div className="absolute bottom-3 right-3 text-xs text-bone/70 font-mono tabular">
                    {session.time} , {session.date}
                  </div>
                </>
              ) : null}
            </div>

            <div className="px-4 py-3 border-t border-rule">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-ink-muted">Recognised this session</span>
                <span className="font-semibold tabular">
                  {presentCount} of {roster.length} matched
                </span>
              </div>
              <div className="h-2 rounded-full bg-paper-dark overflow-hidden">
                <div
                  className="h-full bg-oxblood rounded-full transition-all"
                  style={{
                    width: `${(presentCount / Math.max(roster.length, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {cameraStatus !== "live" ? (
              <button
                type="button"
                onClick={startCamera}
                disabled={
                  modelStatus !== "ready" || cameraStatus === "requesting"
                }
                className="btn btn-primary"
              >
                <Camera size={16} /> Start camera
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="btn btn-ghost"
              >
                <VideoOff size={16} /> Stop camera
              </button>
            )}
            <button
              type="button"
              onClick={clearEnrolment}
              className="btn btn-ghost btn-sm"
            >
              Clear all enrolments ({enrolledCount})
            </button>
            {statusMessage ? (
              <span className="text-sm text-ink-soft">{statusMessage}</span>
            ) : null}
          </div>

          <p className="text-xs text-ink-muted mt-3 leading-relaxed">
            Demo only, descriptors are kept in this browser&apos;s local
            storage. In production these would be encrypted server-side
            with consent recorded per student.
          </p>
        </div>

        <aside className="col-span-12 lg:col-span-5">
          <h2 className="font-semibold text-lg mb-1">
            Roster , {roster.length} students
          </h2>
          <p className="text-xs text-ink-muted mb-4">
            Face capture happens at registration. The button below is a
            mentor-supervised fallback for anyone whose face was never
            captured.
          </p>
          <ul className="card divide-y divide-rule p-0 overflow-hidden">
            {roster.map((s, i) => {
              const enrolled = enrolledMatrics.has(s.matric);
              const present = presentMatrics.has(s.matric);
              return (
                <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xs text-ink-muted w-6 tabular">
                    {i + 1}
                  </span>
                  <div
                    className={`size-9 rounded-full flex items-center justify-center text-xs font-semibold ${
                      present
                        ? "bg-fern/20 text-fern"
                        : "bg-paper-dark text-ink-muted"
                    }`}
                  >
                    {s.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <div className="text-xs text-ink-muted tabular">
                      {s.matric}
                    </div>
                  </div>
                  {present ? (
                    <span className="badge badge-fern inline-flex items-center gap-1">
                      <Check size={12} /> Present
                    </span>
                  ) : enrolled ? (
                    <span className="badge badge-muted">Awaiting</span>
                  ) : (
                    <span className="badge badge-saffron">Not enrolled</span>
                  )}
                  <button
                    type="button"
                    onClick={() => enrollStudent(s.id)}
                    disabled={cameraStatus !== "live" || enrolling === s.id}
                    className="size-8 rounded-sm border border-rule hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label={`Enrol ${s.name}`}
                    title={enrolled ? "Re-capture face" : "Capture face (fallback)"}
                  >
                    {enrolling === s.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : enrolled ? (
                      <UserCheck size={14} />
                    ) : (
                      <UserPlus size={14} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </section>
  );
}
