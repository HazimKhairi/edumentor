"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Info,
  Loader2,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Video,
  VideoOff,
} from "lucide-react";
import { getSessionStatus, verifyAttendance } from "@/lib/actions";

type FaceApi = typeof import("@vladmandic/face-api");

type RosterStudent = {
  id: string;
  name: string;
  matric: string;
  descriptor?: number[] | null;
};

type Session = {
  id: string;
  course: string;
  room: string;
  date: string;
  time: string;
  expected: number;
};

const POLL_INTERVAL_MS = 2500;

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
  // Mentor-side verification, the second signature on a record. A mentee is
  // only "Counted" once both presentMatrics (face match) and verifiedMatrics
  // (mentor tapped Verify) contain their matric.
  const [verifiedMatrics, setVerifiedMatrics] = useState<Set<string>>(new Set());
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

  // Hydrate descriptors: prefer the server-stored ones included in roster, then
  // top up with any localStorage entries (legacy demo accounts).
  useEffect(() => {
    const map: Record<string, Float32Array> = {};
    for (const s of roster) {
      if (s.descriptor && s.descriptor.length > 0) {
        map[s.matric] = new Float32Array(s.descriptor);
      }
    }
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, number[]>;
          for (const [matric, arr] of Object.entries(parsed)) {
            if (!map[matric]) map[matric] = new Float32Array(arr);
          }
        }
      } catch (e) {
        console.warn("failed to restore enrolled faces", e);
      }
    }
    enrolledRef.current = map;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration
    setEnrolledMatrics(new Set(Object.keys(map)));
  }, [roster]);

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
    // Detection loop paints labels + bounding boxes onto the overlay canvas
    // every tick. Wipe it on stop so the last-frame artwork does not linger.
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
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
    setVerifiedMatrics(new Set());
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const toggleVerify = useCallback(
    async (matric: string) => {
      const student = roster.find((r) => r.matric === matric);
      if (!student) return;
      // Optimistic flip then sync with server. If the server rejects we revert.
      setVerifiedMatrics((prev) => new Set(prev).add(matric));
      try {
        await verifyAttendance(session.id, student.id);
      } catch (e) {
        console.error("verify failed", e);
        setVerifiedMatrics((prev) => {
          const next = new Set(prev);
          next.delete(matric);
          return next;
        });
      }
    },
    [roster, session.id],
  );

  // Poll server status, drives both the green Present pulse for newly-confirmed
  // mentees (via menteeConfirmed) and the Counted badge once mentorVerified
  // catches up. Keeps multiple devices in sync.
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const rows = await getSessionStatus(session.id);
        if (cancelled) return;
        const idToMatric = new Map(roster.map((s) => [s.id, s.matric]));
        const present = new Set<string>();
        const verified = new Set<string>();
        for (const r of rows) {
          const m = idToMatric.get(r.menteeId);
          if (!m) continue;
          if (r.menteeConfirmed) present.add(m);
          if (r.mentorVerified) verified.add(m);
        }
        setPresentMatrics((prev) => {
          let changed = prev.size !== present.size;
          if (!changed) for (const m of present) if (!prev.has(m)) { changed = true; break; }
          return changed ? new Set([...prev, ...present]) : prev;
        });
        setVerifiedMatrics((prev) => {
          let changed = prev.size !== verified.size;
          if (!changed) for (const m of verified) if (!prev.has(m)) { changed = true; break; }
          return changed ? new Set([...prev, ...verified]) : prev;
        });
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
  }, [session.id, roster]);

  const presentCount = presentMatrics.size;
  const verifiedCount = verifiedMatrics.size;
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
                Two-step verification, each session
              </p>
              <p className="text-ink-muted leading-relaxed">
                <span className="font-semibold text-ink">Step 1</span>, the camera
                matches each mentee against the descriptor they captured at
                registration and marks them{" "}
                <span className="font-semibold text-fern">Mentee OK</span>.{" "}
                <span className="font-semibold text-ink">Step 2</span>, you tap{" "}
                <span className="font-semibold text-oxblood">Verify</span> on the
                roster to lock the record as{" "}
                <span className="font-semibold text-fern">Counted</span>. A session
                only counts when both signatures are present. Nothing leaves
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

            <div className="px-4 py-3 border-t border-rule space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink-muted">Step 1, face matched</span>
                  <span className="font-semibold tabular">
                    {presentCount} of {roster.length}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden">
                  <div
                    className="h-full bg-saffron rounded-full transition-all"
                    style={{
                      width: `${(presentCount / Math.max(roster.length, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink-muted">Step 2, mentor verified</span>
                  <span className="font-semibold tabular">
                    {verifiedCount} of {roster.length}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden">
                  <div
                    className="h-full bg-oxblood rounded-full transition-all"
                    style={{
                      width: `${(verifiedCount / Math.max(roster.length, 1)) * 100}%`,
                    }}
                  />
                </div>
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
                {modelStatus === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Loading models
                  </>
                ) : cameraStatus === "requesting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Starting camera
                  </>
                ) : (
                  <>
                    <Camera size={16} /> Start camera
                  </>
                )}
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
            Roster, {roster.length} students
          </h2>
          <p className="text-xs text-ink-muted mb-4">
            Tap <span className="font-semibold text-oxblood">Verify</span> next to
            each face-matched mentee to lock their attendance. The fallback button
            re-captures a face for anyone who never registered theirs.
          </p>
          <ul className="card divide-y divide-rule p-0 overflow-hidden">
            {roster.map((s, i) => {
              const enrolled = enrolledMatrics.has(s.matric);
              const present = presentMatrics.has(s.matric);
              const verified = verifiedMatrics.has(s.matric);
              const counted = present && verified;
              return (
                <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xs text-ink-muted w-6 tabular">
                    {i + 1}
                  </span>
                  <div
                    className={`size-9 rounded-full flex items-center justify-center text-xs font-semibold ${
                      counted
                        ? "bg-fern/20 text-fern"
                        : present
                          ? "bg-saffron/20 text-saffron"
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
                  {counted ? (
                    <span className="badge badge-fern inline-flex items-center gap-1">
                      <ShieldCheck size={12} /> Counted
                    </span>
                  ) : present ? (
                    <button
                      type="button"
                      onClick={() => toggleVerify(s.matric)}
                      className="badge badge-saffron hover:bg-oxblood hover:text-bone transition-colors cursor-pointer inline-flex items-center gap-1"
                      title="Lock this mentee's attendance"
                    >
                      <Check size={12} /> Verify
                    </button>
                  ) : enrolled ? (
                    <span className="badge badge-muted">Awaiting face</span>
                  ) : (
                    <span className="badge badge-saffron">Not enrolled</span>
                  )}
                  <button
                    type="button"
                    onClick={() => enrollStudent(s.id)}
                    disabled={cameraStatus !== "live" || enrolling === s.id}
                    className="size-8 rounded-sm border border-rule hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label={`Re-capture face for ${s.name}`}
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
