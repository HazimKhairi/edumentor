"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Check,
  Loader2,
  ScanFace,
  Video,
  VideoOff,
} from "lucide-react";
import {
  MENTOR_MIN_CGPA,
  MENTOR_SUBJECT_CAP,
  ROLES,
  SEMESTERS,
  type Semester,
  coursesForMentee,
  coursesForMentor,
} from "@/lib/data";
import { registerAccount } from "@/lib/actions";

type FaceApi = typeof import("@vladmandic/face-api");

const STORAGE_KEY = "edumentor:enrolled-faces:v2";

type RoleKey = "Mentor" | "Mentee";

// Minimal shape the picker needs from the server-fetched course catalogue.
export type CourseOption = {
  id: string;
  code: string;
  title: string;
  semester: number;
};

export function RegisterForm({ courses }: { courses: CourseOption[] }) {
  const [matric, setMatric] = useState("");
  const [role, setRole] = useState<RoleKey>("Mentee");
  const [semester, setSemester] = useState<Semester>(1);
  const [pickedCourses, setPickedCourses] = useState<string[]>([]);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);

  // Reset course picks when role or semester changes — they may no longer be eligible.
  useEffect(() => {
    setPickedCourses([]);
  }, [role, semester]);

  return (
    <form action={registerAccount} className="space-y-4">
      <input type="hidden" name="semester" value={semester} />
      <input type="hidden" name="faceDescriptor" value={faceDescriptor ? JSON.stringify(faceDescriptor) : ""} />
      {pickedCourses.map((id) => (
        <input key={id} type="hidden" name="courseIds" value={id} />
      ))}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Full name
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Aiman Hakimi"
            className="input py-2 text-sm"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            UiTM email
          </label>
          <input
            type="email"
            name="email"
            placeholder="2023607832@student.uitm.edu.my"
            className="input py-2 text-sm"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Matric number
          </label>
          <input
            type="text"
            name="matric"
            required
            value={matric}
            onChange={(e) => setMatric(e.target.value)}
            placeholder="2023607832"
            className="input py-2 text-sm"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="At least 6 chars"
            className="input py-2 text-sm"
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-7">
          <label className="block text-xs font-medium text-ink mb-1.5">
            I am signing up as
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.filter((r) => r.key !== "Admin").map((r) => (
              <label
                key={r.key}
                className="relative flex items-center gap-2 px-3 py-2 rounded-md border border-rule cursor-pointer hover:border-ink has-[:checked]:border-oxblood has-[:checked]:bg-oxblood/[0.04] transition-colors"
              >
                <input
                  type="radio"
                  name="role"
                  value={r.key}
                  checked={role === r.key}
                  onChange={() => setRole(r.key as RoleKey)}
                  className="sr-only"
                />
                <span className="text-[10px] text-ink-muted font-semibold">
                  {r.abbr}
                </span>
                <span className="text-sm font-medium">{r.key}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="col-span-5">
          <label className="block text-xs font-medium text-ink mb-1.5">
            Current semester
          </label>
          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value) as Semester)}
            className="input py-2 text-sm"
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CoursePicker
        role={role}
        semester={semester}
        picked={pickedCourses}
        onChange={setPickedCourses}
        courses={courses}
      />

      <FaceCaptureStep
        matric={matric}
        captured={faceCaptured}
        onCapture={(descriptor) => {
          setFaceCaptured(true);
          setFaceDescriptor(descriptor);
        }}
        onReset={() => {
          setFaceCaptured(false);
          setFaceDescriptor(null);
        }}
      />

      {role === "Mentor" ? <MentorEligibilityFields /> : null}

      <label className="flex items-start gap-2 text-xs text-ink-soft cursor-pointer">
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

      <button type="submit" className="btn btn-primary w-full">
        Create account
      </button>

      <p className="text-[11px] text-ink-muted text-center">
        Admin (lecturer) accounts are issued internally and cannot self-register.
      </p>
    </form>
  );
}

function CoursePicker({
  role,
  semester,
  picked,
  onChange,
  courses,
}: {
  role: RoleKey;
  semester: Semester;
  picked: string[];
  onChange: (next: string[]) => void;
  courses: CourseOption[];
}) {
  const eligible = useMemo(
    () =>
      role === "Mentor"
        ? coursesForMentor(semester, courses)
        : coursesForMentee(semester, courses),
    [role, semester, courses],
  );

  const cap = role === "Mentor" ? MENTOR_SUBJECT_CAP : courses.length;
  const reachedCap = picked.length >= cap;

  const toggle = (id: string) => {
    if (picked.includes(id)) {
      onChange(picked.filter((x) => x !== id));
      return;
    }
    if (reachedCap) return;
    onChange([...picked, id]);
  };

  const helper =
    role === "Mentor"
      ? `Pick up to ${MENTOR_SUBJECT_CAP} subjects from semesters you have already passed.`
      : "Pick the subjects you are taking this semester.";

  return (
    <div className="rounded-md border border-rule bg-paper-dark/40 p-3 space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="block text-xs font-semibold text-ink">
          {role === "Mentor" ? "Subjects to mentor" : "Subjects to join"}
        </label>
        <span className="text-[11px] text-ink-muted tabular">
          {picked.length} / {role === "Mentor" ? MENTOR_SUBJECT_CAP : eligible.length}
        </span>
      </div>
      <p className="text-[11px] text-ink-muted">{helper}</p>

      {eligible.length === 0 ? (
        <p className="text-[11px] text-ink-soft py-2">
          {role === "Mentor"
            ? "No earlier-semester subjects available, mentors must have passed at least one semester."
            : "No subjects offered for this semester yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {eligible.map((c) => {
            const isPicked = picked.includes(c.id);
            const disabled = !isPicked && reachedCap;
            return (
              <label
                key={c.id}
                className={`flex items-start gap-2 px-2.5 py-2 rounded-md border text-xs cursor-pointer transition-colors ${
                  isPicked
                    ? "border-oxblood bg-oxblood/[0.05]"
                    : disabled
                      ? "border-rule opacity-50 cursor-not-allowed"
                      : "border-rule hover:border-ink"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isPicked}
                  onChange={() => toggle(c.id)}
                  disabled={disabled}
                  className="size-3.5 mt-0.5 accent-oxblood shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink truncate">
                    {c.code}
                  </span>
                  <span className="block text-[10px] text-ink-muted truncate">
                    Sem {c.semester} | {c.title}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MentorEligibilityFields() {
  return (
    <div className="rounded-md border border-rule bg-paper-dark/40 p-3 space-y-3">
      <p className="text-xs text-ink-muted leading-relaxed">
        Mentor applicants need a current CGPA of{" "}
        <span className="font-semibold text-ink">
          {MENTOR_MIN_CGPA.toFixed(2)} or higher
        </span>
        . Reviewed by the registrar.
      </p>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-5">
          <label className="block text-xs font-medium text-ink mb-1">
            Current CGPA
          </label>
          <input
            type="number"
            name="cgpa"
            step="0.01"
            min="0"
            max="4"
            placeholder="3.74"
            className="input py-2 text-sm"
          />
        </div>
        <div className="col-span-7">
          <label className="block text-xs font-medium text-ink mb-1">
            Latest transcript (PDF)
          </label>
          <button
            type="button"
            className="btn btn-ghost btn-sm w-full justify-center border border-dashed border-rule"
          >
            Browse files, up to 5 MB
          </button>
        </div>
      </div>
    </div>
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
  onCapture: (descriptor: number[]) => void;
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
      const desc = map[matric.trim()];
      if (desc) {
        onCapture(desc);
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

  // Detection loop just to draw bounding box and count faces
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
      setStatusMessage("Enter your matric first.");
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
        setStatusMessage("No face detected.");
        return;
      }
      const descArray = Array.from(detection.descriptor);
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
      map[matric.trim()] = descArray;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      onCapture(descArray);
      setStatusMessage("Face captured.");
      stopCamera();
    } catch (e) {
      console.error("capture failed", e);
      setStatusMessage("Capture failed.");
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

  if (captured) {
    return (
      <div className="rounded-md border border-fern/30 bg-fern/10 p-3 flex items-center gap-3">
        <span className="size-9 rounded-full bg-fern/20 text-fern flex items-center justify-center shrink-0">
          <Check size={18} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">
            Face captured for matric{" "}
            <span className="tabular">{matric.trim() || "(none)"}</span>
          </p>
          <p className="text-[11px] text-ink-muted">
            Used by the classroom camera to mark you present.
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
    );
  }

  // Idle: compact card with just CTA
  if (cameraStatus === "idle") {
    return (
      <div className="rounded-md border border-rule bg-paper-dark/40 p-3 flex items-center gap-3">
        <span className="size-9 rounded-md bg-oxblood/15 text-oxblood flex items-center justify-center shrink-0">
          <ScanFace size={18} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">
            Face capture for attendance{" "}
            <span className="text-[11px] font-normal text-ink-muted">
              (KYC, runs in your browser)
            </span>
          </p>
          <p className="text-[11px] text-ink-muted">
            128-number descriptor bound to your matric, no photo stored.
          </p>
        </div>
        <button
          type="button"
          onClick={startCamera}
          disabled={modelStatus !== "ready" || !matric.trim()}
          className="btn btn-secondary btn-sm shrink-0"
        >
          {modelStatus === "loading" ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Loading
            </>
          ) : (
            <>
              <Camera size={14} /> Start
            </>
          )}
        </button>
      </div>
    );
  }

  // Active: show camera preview
  return (
    <div className="rounded-md border border-rule bg-paper-dark/40 p-3 space-y-3">
      <div className="flex items-center gap-2">
        <span className="size-7 rounded-md bg-oxblood/15 text-oxblood flex items-center justify-center shrink-0">
          <ScanFace size={14} />
        </span>
        <p className="text-sm font-semibold text-ink flex-1">
          Capture your face
        </p>
        {cameraStatus === "live" ? (
          <span className="text-[11px] text-ink-muted inline-flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-oxblood blink" />
            {faceCount} detected
          </span>
        ) : null}
      </div>

      <div className="card p-0 overflow-hidden">
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
          {cameraStatus !== "live" ? (
            <div className="relative z-10 text-center text-bone/85 px-4">
              <Video size={28} className="mx-auto mb-1.5 opacity-80" />
              <p className="text-xs">
                {cameraStatus === "denied"
                  ? "Camera permission denied"
                  : cameraStatus === "error"
                    ? "Camera unavailable"
                    : "Requesting camera"}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {cameraStatus === "live" ? (
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
              <VideoOff size={14} /> Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setCameraStatus("idle")}
            className="btn btn-ghost btn-sm"
          >
            Back
          </button>
        )}
        {statusMessage ? (
          <span className="text-[11px] text-ink-soft">{statusMessage}</span>
        ) : null}
      </div>
    </div>
  );
}
