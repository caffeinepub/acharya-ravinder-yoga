import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import {
  useGetTotalEnrollments,
  useSubmitEnrollment,
} from "@/hooks/useQueries";
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Play,
  Shield,
  Star,
  Timer,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function useCountdown() {
  const endRef = useRef(Date.now() + 24 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endRef.current - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

function CountdownTimer() {
  const { h, m, s } = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div
      className="flex items-center gap-2 justify-center"
      data-ocid="pricing.countdown"
    >
      {[
        { label: "HRS", val: h },
        { label: "MIN", val: m },
        { label: "SEC", val: s },
      ].map((item, i) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className="countdown-block">
            <div className="text-white text-2xl font-poppins font-bold">
              {pad(item.val)}
            </div>
            <div className="text-green-300 text-xs font-medium">
              {item.label}
            </div>
          </div>
          {i < 2 && (
            <span className="text-green-300 text-2xl font-bold">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Enrollment Modal ─────────────────────────────────────────────────────────
interface EnrollModalProps {
  open: boolean;
  onClose: () => void;
}

function EnrollModal({ open, onClose }: EnrollModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const { mutateAsync, isPending } = useSubmitEnrollment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    try {
      await mutateAsync({ name, email, phone });
      setSubmitted(true);
      toast.success("Enrollment successful!");
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSubmitted(false);
    setFormError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md rounded-2xl p-0 overflow-hidden"
        data-ocid="enroll.modal"
      >
        <div className="bg-brand-green p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-poppins font-bold">
              🧘 Join 21 Day Challenge
            </DialogTitle>
          </DialogHeader>
          <p className="text-green-100 text-sm mt-1">
            Complete your enrollment below. We'll WhatsApp you the details!
          </p>
        </div>

        <div className="p-6">
          {submitted ? (
            <div
              className="text-center py-6 space-y-3"
              data-ocid="enroll.success_state"
            >
              <div className="text-5xl">✅</div>
              <h3 className="text-lg font-poppins font-bold text-brand-dark">
                You're Enrolled!
              </h3>
              <p className="text-brand-muted text-sm">
                We'll WhatsApp you the details shortly. Get ready to transform!
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 w-full bg-brand-green text-white font-poppins font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
                data-ocid="enroll.close_button"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="enroll-name"
                  className="text-sm font-semibold text-brand-dark"
                >
                  Full Name *
                </Label>
                <Input
                  id="enroll-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1 rounded-xl border-gray-200"
                  data-ocid="enroll.name.input"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="enroll-email"
                  className="text-sm font-semibold text-brand-dark"
                >
                  Email Address *
                </Label>
                <Input
                  id="enroll-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1 rounded-xl border-gray-200"
                  data-ocid="enroll.email.input"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="enroll-phone"
                  className="text-sm font-semibold text-brand-dark"
                >
                  WhatsApp Number *
                </Label>
                <Input
                  id="enroll-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-1 rounded-xl border-gray-200"
                  data-ocid="enroll.phone.input"
                  required
                />
              </div>

              {formError && (
                <p
                  className="text-urgency text-sm"
                  data-ocid="enroll.error_state"
                >
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand-green text-white font-poppins font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 text-base"
                data-ocid="enroll.submit_button"
              >
                {isPending ? "Confirming..." : "Confirm Enrollment – ₹499"}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-brand-muted">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Secure
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 7 Day Guarantee
                </span>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────
const faqItems = [
  {
    q: "Is this beginner friendly?",
    a: "Yes, completely beginner friendly. No prior yoga experience needed. All sessions are designed for absolute beginners.",
  },
  {
    q: "Will I lose weight?",
    a: "Results depend on consistency, but most students lose 3–6 kg following the 21-day system. Hundreds of students have seen real results.",
  },
  {
    q: "What if I miss a class?",
    a: "Recording is provided for all sessions so you never fall behind, even if you miss a live class.",
  },
  {
    q: "Do I need a gym?",
    a: "No. All sessions are done at home with zero equipment. Just a yoga mat and your commitment.",
  },
  {
    q: "Is a diet required?",
    a: "Simple Indian diet guidance is included. No starvation diets — just easy, sustainable habits that complement your yoga practice.",
  },
  {
    q: "What is the refund policy?",
    a: "7-day satisfaction guarantee. If you're not satisfied within 7 days, you'll get a full refund — no questions asked.",
  },
];

function FaqItem({
  item,
  index,
}: { item: (typeof faqItems)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-card transition-shadow"
      data-ocid={`faq.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 text-left font-poppins font-semibold text-brand-dark hover:text-brand-green transition-colors"
        onClick={() => setOpen((v) => !v)}
        data-ocid={`faq.toggle.${index + 1}`}
        aria-expanded={open}
      >
        <span className="text-sm md:text-base">{item.q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 shrink-0 text-brand-green" />
        ) : (
          <ChevronDown className="w-5 h-5 shrink-0 text-brand-muted" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-brand-muted leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Green CTA Button ─────────────────────────────────────────────────────────
interface GreenCTAProps {
  label: string;
  onClick: () => void;
  ocid: string;
  size?: "lg" | "md";
  className?: string;
}
function GreenCTA({
  label,
  onClick,
  ocid,
  size = "lg",
  className = "",
}: GreenCTAProps) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className={`bg-brand-green hover:opacity-90 active:scale-[0.98] transition-all text-white font-poppins font-bold rounded-xl shadow-card-hover ${
        size === "lg"
          ? "py-4 px-8 text-base md:text-lg"
          : "py-3 px-6 text-sm md:text-base"
      } ${className}`}
    >
      {label}
    </button>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: totalEnrollments } = useGetTotalEnrollments();
  const enrollCount = totalEnrollments
    ? Number(totalEnrollments) + 50342
    : 50342;

  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Toaster />
      <EnrollModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ── TOP OFFER BAR ─────────────────────────────────────────────────── */}
      <div className="bg-brand-green text-white py-2 px-4 text-center text-sm font-semibold sticky top-0 z-[60]">
        <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>🔥 21-Day Weight Loss Challenge</span>
          <span className="font-black">Only ₹499 Today</span>
          <span className="text-green-100">
            ⏳ Limited Seats — Batch Starting Soon!
          </span>
        </span>
      </div>

      {/* ── STICKY HEADER ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-9 z-50 bg-white border-b border-gray-100 shadow-xs"
        data-ocid="nav.section"
      >
        <div className="container-max flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧘</span>
            <span className="font-poppins font-bold text-brand-dark text-base md:text-lg">
              Acharya Ravinder
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-brand-muted">
            <a
              href="#results"
              className="hover:text-brand-green transition-colors"
              data-ocid="nav.results.link"
            >
              Results
            </a>
            <a
              href="#program"
              className="hover:text-brand-green transition-colors"
              data-ocid="nav.program.link"
            >
              Program
            </a>
            <a
              href="#pricing"
              className="hover:text-brand-green transition-colors"
              data-ocid="nav.pricing.link"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:text-brand-green transition-colors"
              data-ocid="nav.faq.link"
            >
              FAQ
            </a>
          </nav>
          <button
            type="button"
            onClick={openModal}
            className="bg-brand-green text-white font-poppins font-bold py-2 px-5 rounded-xl text-sm hover:opacity-90 transition-opacity"
            data-ocid="nav.join.primary_button"
          >
            Join ₹499
          </button>
        </div>
      </header>

      {/* ── SECTION 1: HERO ───────────────────────────────────────────────── */}
      <section id="hero" className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left */}
            <div className="space-y-5 animate-fadeInUp">
              {/* Urgency badges */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-red-50 text-urgency border border-red-200 text-xs font-bold px-3 py-1.5 rounded-full">
                  🔥 Only Limited Seats Available
                </span>
                <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-bold px-3 py-1.5 rounded-full">
                  ⏳ Batch Starting Soon
                </span>
                <span className="bg-orange-50 text-brand-orange border border-orange-200 text-xs font-bold px-3 py-1.5 rounded-full">
                  💰 Offer Ending Today
                </span>
              </div>

              <h1 className="font-poppins font-extrabold text-4xl md:text-5xl text-brand-dark leading-tight">
                21 Day Weight Loss{" "}
                <span className="text-brand-green">Yoga Challenge</span>
              </h1>
              <p className="font-poppins font-bold text-xl md:text-2xl text-brand-dark">
                Lose 3–6 Kg Naturally Without Gym or Diet Confusion
              </p>
              <p className="text-brand-muted text-base leading-relaxed">
                Join India's fastest growing online yoga weight loss challenge.
                Daily live sessions, guided routines and accountability support
                designed for real results.
              </p>

              {/* Price Box */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-card flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="strikethrough text-brand-muted text-sm">
                    Earlier Price ₹799
                  </div>
                  <div className="font-poppins font-black text-3xl text-brand-green">
                    Today Only ₹499
                  </div>
                </div>
                <div className="bg-brand-orange text-white font-poppins font-bold text-sm px-4 py-2 rounded-full shadow-sm">
                  ₹300 OFF
                </div>
              </div>

              <button
                type="button"
                onClick={openModal}
                className="w-full bg-brand-green text-white font-poppins font-extrabold py-4 rounded-xl text-lg shadow-green-glow hover:opacity-90 active:scale-[0.99] transition-all"
                data-ocid="hero.primary_button"
              >
                Join 21 Day Challenge for ₹499
              </button>

              {/* Trust line */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {[
                  "Beginner Friendly",
                  "Live Guided Sessions",
                  "Proven Weight Loss System",
                ].map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 text-sm text-brand-muted"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                    {t}
                  </span>
                ))}
              </div>

              {/* Live count */}
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                <span className="text-sm text-brand-muted">
                  <strong className="text-brand-green">
                    {enrollCount.toLocaleString()}+
                  </strong>{" "}
                  students already enrolled
                </span>
              </div>
            </div>

            {/* Right — transformation collage */}
            <div className="relative animate-slideDown">
              <div
                className="rounded-2xl overflow-hidden shadow-hero bg-green-50 border-4 border-green-200"
                data-ocid="hero.canvas_target"
              >
                <img
                  src="/assets/yoga_dp-019d524f-f50b-77e9-bfb3-b47b6bb3ff55.png"
                  alt="Real student yoga transformations — before and after"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent pointer-events-none rounded-2xl" />
              </div>
              {/* Real Results badge */}
              <div className="absolute top-4 right-4 bg-brand-green text-white font-poppins font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                ✨ Real Results
              </div>
              {/* Before/After grid overlay label */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-xl px-4 py-2.5 flex flex-wrap gap-2 justify-center shadow-xs">
                {[
                  "Lost 5 kg in 21 days",
                  "Lost 8 kg in 2 months",
                  "Reduced Belly Fat",
                  "Better Stamina",
                ].map((r) => (
                  <span
                    key={r}
                    className="text-xs font-semibold text-brand-green"
                  >
                    ✅ {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Bar */}
        <div className="mt-12 bg-brand-mint">
          <div className="container-max py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "⭐", label: "4.9 Rating" },
                { icon: "👥", label: "50,000+ Students" },
                { icon: "🧘", label: "12+ Years Experience" },
                { icon: "🌍", label: "Multiple Countries" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-2 py-2"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-poppins font-bold text-sm text-brand-dark">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PROBLEM ────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-brand-dark text-center mb-4">
            Why Most People Fail At Weight Loss
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {[
              {
                icon: "❌",
                title: "Slow Metabolism",
                desc: "Metabolism doesn't burn fat efficiently",
              },
              {
                icon: "❌",
                title: "Stubborn Belly Fat",
                desc: "Fat deposits that won't budge",
              },
              {
                icon: "❌",
                title: "No Consistency",
                desc: "Starting strong but losing motivation",
              },
              {
                icon: "⚠️",
                title: "Random Workouts",
                desc: "No structured system or progression",
              },
              {
                icon: "⚠️",
                title: "Lack of Guidance",
                desc: "No expert to correct your form",
              },
              {
                icon: "⚠️",
                title: "No Accountability",
                desc: "No support to keep you on track",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                data-ocid={`problem.item.${i + 1}`}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-card transition-shadow"
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-poppins font-bold text-brand-dark mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-brand-muted">{card.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center font-poppins font-semibold text-xl text-brand-green italic">
            This is exactly why this 21 Day Challenge was created.
          </p>
          <div className="flex justify-center mt-6">
            <GreenCTA
              label="Yes I Want To Transform"
              onClick={openModal}
              ocid="problem.primary_button"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SOLUTION ───────────────────────────────────────────── */}
      <section className="section-padding bg-brand-mint">
        <div className="container-max">
          <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-brand-dark text-center mb-4">
            How This 21 Day Challenge{" "}
            <span className="text-brand-green">Transforms Your Body</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: "🔥",
                title: "Daily Fat Burning Yoga",
                points: [
                  "Structured daily sessions",
                  "Progressive routines",
                  "Metabolism activation",
                ],
              },
              {
                icon: "🥗",
                title: "Weight Loss Diet Guidance",
                points: [
                  "Simple Indian diet guidance",
                  "No starvation diets",
                  "Sustainable habits",
                ],
              },
              {
                icon: "📱",
                title: "Accountability System",
                points: [
                  "WhatsApp support group",
                  "Daily reminders",
                  "Motivation tracking",
                ],
              },
            ].map((card, i) => (
              <div
                key={card.title}
                data-ocid={`solution.item.${i + 1}`}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="text-5xl mb-4">{card.icon}</div>
                <h3 className="font-poppins font-bold text-brand-dark text-lg mb-3">
                  {card.title}
                </h3>
                <ul className="space-y-2">
                  {card.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2 text-sm text-brand-muted"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <GreenCTA
              label="Yes I Want To Lose Weight"
              onClick={openModal}
              ocid="solution.primary_button"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 4: TRANSFORMATION PROOF ──────────────────────────────── */}
      <section id="results" className="section-padding bg-white">
        <div className="container-max">
          <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-brand-dark text-center mb-2">
            Real Student Transformations
          </h2>
          <p className="text-brand-muted text-center mb-10">
            Real results from real students who followed the system
            consistently.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Lost 5 kg in 21 days",
                gradient: "from-gray-300 to-green-200",
              },
              {
                label: "Lost 8 kg in 2 months",
                gradient: "from-gray-300 to-green-300",
              },
              {
                label: "Reduced Belly Fat",
                gradient: "from-gray-200 to-green-200",
              },
              {
                label: "Improved Stamina",
                gradient: "from-gray-200 to-green-400",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                data-ocid={`results.item.${i + 1}`}
                className="rounded-2xl overflow-hidden shadow-card"
              >
                <div
                  className={`bg-gradient-to-br ${item.gradient} aspect-[3/4] flex flex-col items-center justify-center gap-3 p-4`}
                >
                  <div className="text-3xl">🧘</div>
                  <div className="bg-white/90 rounded-xl px-3 py-1.5 text-center">
                    <div className="text-[10px] font-bold text-brand-muted uppercase tracking-wide">
                      Before → After
                    </div>
                  </div>
                </div>
                <div className="bg-brand-green text-white text-xs font-poppins font-bold text-center py-2 px-2">
                  ✅ {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { stat: "3–6 kg", desc: "Average weight loss in 21 days" },
              { stat: "50,000+", desc: "Students trained" },
              { stat: "4.9⭐", desc: "Average student rating" },
              { stat: "95%", desc: "Students see results" },
            ].map((item, i) => (
              <div
                key={item.desc}
                data-ocid={`results.stat.item.${i + 1}`}
                className="bg-brand-mint rounded-2xl p-4 text-center"
              >
                <div className="font-poppins font-black text-2xl text-brand-green">
                  {item.stat}
                </div>
                <div className="text-xs text-brand-muted mt-1">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <GreenCTA
              label="Start My Transformation"
              onClick={openModal}
              ocid="results.primary_button"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 5: VIDEO TESTIMONIALS ─────────────────────────────────── */}
      <section className="section-padding bg-brand-mint">
        <div className="container-max">
          <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-brand-dark text-center mb-10">
            Watch Real Student Results
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                data-ocid={`testimonials.item.${n}`}
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-hero aspect-video flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-700 transition-colors group"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-brand-green/80 transition-colors">
                  <Play className="w-7 h-7 text-white fill-white" />
                </div>
                <div className="text-white font-poppins font-bold text-sm">
                  Video Review {n}
                </div>
                <div className="flex gap-1">
                  {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
                    <Star
                      key={sk}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-brand-muted mt-8 text-sm font-semibold italic">
            No paid actors. Only real students sharing real results.
          </p>
          <div className="flex justify-center mt-6">
            <GreenCTA
              label="Join Next Batch"
              onClick={openModal}
              ocid="testimonials.primary_button"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 6: WHAT YOU GET ────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-brand-dark text-center mb-10">
            What You Get Inside 21 Day Challenge
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Benefits checklist */}
            <div className="space-y-3">
              {[
                "21 Live Yoga Sessions",
                "Daily fat loss routines",
                "Simple diet plan",
                "Morning & evening batch options",
                "WhatsApp support group",
                "Progress tracking guidance",
                "Recording access",
                "Beginner friendly routines",
              ].map((item, i) => (
                <div
                  key={item}
                  data-ocid={`benefits.item.${i + 1}`}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100"
                >
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0" />
                  <span className="font-semibold text-brand-dark">{item}</span>
                </div>
              ))}
            </div>

            {/* Bonus box + value stack */}
            <div className="space-y-6">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-card">
                <div className="font-poppins font-black text-amber-700 text-xl mb-4">
                  🎁 FREE BONUS
                </div>
                <ul className="space-y-3">
                  {[
                    "Weight Loss Diet Guide PDF",
                    "Morning Detox Routine",
                    "Belly Fat Reduction Yoga Routine",
                  ].map((bonus) => (
                    <li
                      key={bonus}
                      className="flex items-center gap-2 text-amber-800 font-semibold"
                    >
                      <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                      {bonus}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brand-mint border border-green-200 rounded-2xl p-6 text-center shadow-card">
                <div className="strikethrough text-brand-muted text-base">
                  Total Value ₹2,500+
                </div>
                <div className="font-poppins font-black text-4xl text-brand-green mt-1">
                  Today Only ₹499
                </div>
                <div className="text-sm text-brand-muted mt-1">
                  You save over ₹2,000!
                </div>
              </div>

              <button
                type="button"
                onClick={openModal}
                className="w-full bg-brand-green text-white font-poppins font-extrabold py-4 rounded-xl text-lg shadow-green-glow hover:opacity-90 transition-opacity"
                data-ocid="benefits.join.primary_button"
              >
                Join Now At ₹499
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: PROGRAM STRUCTURE ──────────────────────────────────── */}
      <section id="program" className="section-padding bg-brand-mint">
        <div className="container-max">
          <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-brand-dark text-center mb-10">
            How The 21 Day Challenge Works
          </h2>

          {/* Desktop timeline / mobile list */}
          <div className="hidden md:flex items-start gap-0">
            {[
              {
                step: 1,
                title: "Join Challenge",
                desc: "Sign up and secure your spot",
              },
              {
                step: 2,
                title: "Get WhatsApp Access",
                desc: "Join the support community",
              },
              {
                step: 3,
                title: "Attend Daily Sessions",
                desc: "Live yoga every single day",
              },
              {
                step: 4,
                title: "Follow Guidance",
                desc: "Diet tips + accountability",
              },
              {
                step: 5,
                title: "Track Transformation",
                desc: "Measure your real progress",
              },
            ].map((s, i, arr) => (
              <div
                key={s.step}
                className="flex-1 flex flex-col items-center text-center"
              >
                <div className="flex items-center w-full">
                  <div
                    className="flex-1 h-0.5 bg-green-200"
                    style={{ visibility: i === 0 ? "hidden" : "visible" }}
                  />
                  <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-poppins font-black text-lg shrink-0 shadow-card">
                    {s.step}
                  </div>
                  <div
                    className="flex-1 h-0.5 bg-green-200"
                    style={{
                      visibility: i === arr.length - 1 ? "hidden" : "visible",
                    }}
                  />
                </div>
                <div className="mt-3 px-2">
                  <div className="font-poppins font-bold text-brand-dark text-sm">
                    {s.title}
                  </div>
                  <div className="text-xs text-brand-muted mt-1">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden flex-col gap-4">
            {[
              {
                step: 1,
                title: "Join Challenge",
                desc: "Sign up and secure your spot",
              },
              {
                step: 2,
                title: "Get WhatsApp Access",
                desc: "Join the support community",
              },
              {
                step: 3,
                title: "Attend Daily Sessions",
                desc: "Live yoga every single day",
              },
              {
                step: 4,
                title: "Follow Guidance",
                desc: "Diet tips + accountability",
              },
              {
                step: 5,
                title: "Track Transformation",
                desc: "Measure your real progress",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-xs"
              >
                <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-poppins font-black text-base shrink-0">
                  {s.step}
                </div>
                <div>
                  <div className="font-poppins font-bold text-brand-dark">
                    {s.title}
                  </div>
                  <div className="text-sm text-brand-muted">{s.desc}</div>
                </div>
                {i < 4 && (
                  <div className="absolute left-9 mt-10 h-4 w-0.5 bg-green-200" />
                )}
              </div>
            ))}
          </div>

          <p className="mt-10 text-center font-poppins font-bold text-xl text-brand-green">
            Consistency for 21 days can change your body.
          </p>
        </div>
      </section>

      {/* ── SECTION 7B: DAILY CLASS SCHEDULE ─────────────────────────────── */}
      <section id="schedule" className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-10">
            <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-brand-dark mb-3">
              Daily Class Schedule
            </h2>
            <p className="text-brand-muted text-lg">
              Choose the timing that fits your lifestyle. Multiple batches
              available.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Day label */}
            <div className="text-center mb-6">
              <span className="inline-block bg-brand-green text-white font-poppins font-bold px-5 py-2 rounded-full text-sm">
                Monday to Friday — Daily Live Classes
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Morning Batches */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌅</span>
                  <h3 className="font-poppins font-extrabold text-xl text-amber-800">
                    Morning Batches
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-xs">
                    <div className="font-poppins font-black text-brand-green text-lg">
                      6:00 AM – 7:00 AM
                    </div>
                    <div className="font-semibold text-brand-dark mt-0.5">
                      Morning Power Yoga
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-xs">
                    <div className="font-poppins font-black text-brand-green text-lg">
                      10:00 AM – 11:00 AM
                    </div>
                    <div className="font-semibold text-brand-dark mt-0.5">
                      Mid-Morning Flow
                    </div>
                  </div>
                </div>
              </div>

              {/* Evening Batches */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌙</span>
                  <h3 className="font-poppins font-extrabold text-xl text-indigo-800">
                    Evening Batches
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-xs">
                    <div className="font-poppins font-black text-brand-green text-lg">
                      6:00 PM – 7:00 PM
                    </div>
                    <div className="font-semibold text-brand-dark mt-0.5">
                      Evening Flexibility &amp; Strength
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-xs">
                    <div className="font-poppins font-black text-brand-green text-lg">
                      9:00 PM – 9:30 PM
                    </div>
                    <div className="font-semibold text-brand-dark mt-0.5">
                      Night Meditation &amp; Pranayama
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Join note */}
            <div className="bg-brand-mint border border-green-200 rounded-2xl p-5 text-center shadow-xs">
              <p className="text-brand-dark font-semibold">
                🌐 All classes via{" "}
                <span className="text-brand-green font-bold">
                  Google Meet / Zoom
                </span>{" "}
                — Join from anywhere in the world
              </p>
              <div className="inline-flex items-center gap-2 mt-3 bg-brand-green text-white text-sm font-poppins font-bold px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Live Right Now
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              type="button"
              onClick={openModal}
              className="bg-brand-green text-white font-poppins font-extrabold py-4 px-10 rounded-xl text-lg shadow-green-glow hover:opacity-90 transition-opacity"
              data-ocid="schedule.primary_button"
            >
              Book Your Batch Now
            </button>
          </div>
        </div>
      </section>
      {/* ── SECTION 8: INSTRUCTOR ─────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-brand-dark text-center mb-10">
            Meet Your Coach
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src="/assets/generated/instructor-acharya-ravinder.dim_400x400.jpg"
                  alt="Acharya Ravinder — Certified Yoga Acharya"
                  className="w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover shadow-hero border-4 border-brand-green"
                />
                <div className="absolute -bottom-3 -right-3 bg-brand-green text-white font-poppins font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                  ✓ Certified Acharya
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-poppins font-black text-3xl text-brand-dark">
                  Acharya Ravinder
                </h3>
                <p className="text-brand-green font-semibold mt-1">
                  Certified Yoga Acharya
                </p>
              </div>
              <div className="space-y-2">
                {[
                  "12+ Years Experience",
                  "50,000+ Students Trained",
                  "Specialist in Weight Loss Yoga",
                  "Patanjali Trained Instructor",
                ].map((cred) => (
                  <div
                    key={cred}
                    className="flex items-center gap-2 text-brand-dark"
                  >
                    <Award className="w-5 h-5 text-brand-green shrink-0" />
                    <span className="font-semibold">{cred}</span>
                  </div>
                ))}
              </div>
              <p className="text-brand-muted leading-relaxed">
                Helping people transform their health through structured yoga
                systems. With over a decade of experience training 50,000+
                students globally, Acharya Ravinder has developed a proven
                method that delivers real, sustainable results.
              </p>
              <GreenCTA
                label="Join His 21 Day Challenge"
                onClick={openModal}
                ocid="instructor.primary_button"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: PRICING + URGENCY ──────────────────────────────────── */}
      <section id="pricing" className="section-padding bg-brand-mint">
        <div className="container-max">
          <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-brand-dark text-center mb-2">
            21 Day Transformation Challenge
          </h2>
          <p className="text-brand-muted text-center mb-10">
            Join today before the batch fills up
          </p>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl border-t-4 border-brand-green shadow-popular overflow-hidden">
              <div className="p-6 space-y-4">
                {/* Badge */}
                <div className="flex justify-center">
                  <span className="bg-brand-green text-white text-xs font-poppins font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    MOST POPULAR
                  </span>
                </div>

                <h3 className="font-poppins font-black text-xl text-brand-dark text-center">
                  21 Day Challenge
                </h3>

                <div className="text-center">
                  <div className="strikethrough text-brand-muted text-lg">
                    ₹799
                  </div>
                  <div className="font-poppins font-black text-5xl text-brand-green">
                    ₹499
                  </div>
                  <div className="text-sm text-brand-muted mt-1">
                    Today Only
                  </div>
                  <div className="inline-block bg-green-100 text-brand-green font-poppins font-bold text-sm px-4 py-1 rounded-full mt-2">
                    You Save ₹300
                  </div>
                </div>

                {/* Includes */}
                <div className="space-y-2">
                  {[
                    "21 live sessions",
                    "Diet guidance",
                    "Support group",
                    "Recordings included",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-brand-dark"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Countdown */}
                <div className="bg-brand-green-dark rounded-2xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Timer className="w-4 h-4 text-green-300" />
                    <span className="text-green-200 text-xs font-semibold uppercase tracking-wide">
                      Offer Expires In
                    </span>
                  </div>
                  <CountdownTimer />
                </div>

                {/* Urgency */}
                <div className="space-y-1.5 text-sm">
                  <p className="text-urgency font-bold">
                    🔥 Limited Seats Per Batch
                  </p>
                  <p className="text-urgency font-semibold">
                    ⏳ Price increases after batch fills
                  </p>
                  <p className="text-urgency font-semibold">
                    ⚠️ Next batch may close anytime
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openModal}
                  className="w-full bg-brand-green text-white font-poppins font-extrabold py-4 rounded-xl text-lg shadow-green-glow hover:opacity-90 active:scale-[0.99] transition-all"
                  data-ocid="pricing.primary_button"
                >
                  Join Challenge Now ₹499
                </button>

                {/* Reassurance */}
                <div className="flex items-center justify-center gap-2 text-sm text-brand-muted">
                  <Shield className="w-4 h-4 text-brand-green" />
                  <span>7 Day Satisfaction Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 10: FAQ ───────────────────────────────────────────────── */}
      <section id="faq" className="section-padding bg-white">
        <div className="container-max max-w-2xl">
          <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-brand-dark text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <FaqItem key={item.q} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 11: FINAL CTA ─────────────────────────────────────────── */}
      <section className="section-padding bg-brand-green-dark">
        <div className="container-max text-center space-y-6">
          <h2 className="font-poppins font-extrabold text-3xl md:text-5xl text-white leading-tight">
            Your Transformation Can Start Today
          </h2>
          <p className="text-green-200 text-lg max-w-xl mx-auto leading-relaxed">
            21 days from now you can either stay the same or become lighter,
            healthier and more confident. Decision is yours.
          </p>
          <div className="text-white text-xl font-poppins">
            <span className="strikethrough text-green-400 mr-2">₹799</span>
            <span className="font-black text-3xl">₹499 Today</span>
          </div>
          <p className="text-urgency font-poppins font-bold">
            ⏰ Next batch starting soon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              type="button"
              onClick={openModal}
              className="bg-brand-green text-white font-poppins font-extrabold py-4 px-10 rounded-xl text-lg shadow-green-glow hover:opacity-90 transition-opacity"
              data-ocid="finalcta.primary_button"
            >
              Join 21 Day Weight Loss Challenge
            </button>
            <a
              href="https://wa.me/911234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white font-poppins font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/10 transition-colors"
              data-ocid="finalcta.whatsapp.primary_button"
            >
              💬 Chat On WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION 12: FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-brand-green-dark border-t border-green-800">
        <div className="container-max py-10">
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: <Users className="w-4 h-4" />, label: "50K+ Students" },
              {
                icon: <Award className="w-4 h-4" />,
                label: "12 Years Experience",
              },
              { icon: <Star className="w-4 h-4" />, label: "4.9 Rating" },
              {
                icon: <CheckCircle2 className="w-4 h-4" />,
                label: "Proven Results",
              },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20"
              >
                {badge.icon}
                {badge.label}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-green-200">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🧘</span>
                <span className="font-poppins font-bold text-white text-lg">
                  Acharya Ravinder
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Transforming lives through structured yoga systems for over 12
                years.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-poppins font-bold text-white mb-3">
                Contact Us
              </h4>
              <div className="space-y-2 text-sm">
                <div>📞 +91 XXXXXXXXXX</div>
                <a
                  href="https://wa.me/911234567890"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                  data-ocid="footer.whatsapp.link"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a
                  href="https://instagram.com"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                  data-ocid="footer.instagram.link"
                >
                  📸 Instagram
                </a>
                <a
                  href="https://youtube.com"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                  data-ocid="footer.youtube.link"
                >
                  ▶️ YouTube
                </a>
              </div>
            </div>

            {/* Note */}
            <div>
              <h4 className="font-poppins font-bold text-white mb-3">
                Important Note
              </h4>
              <p className="text-sm leading-relaxed">
                Limited seats per batch to maintain quality coaching and
                personal attention for every student.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-sm">
                <Shield className="w-4 h-4 text-brand-green" />
                <span className="text-white font-semibold">
                  7 Day Money Back Guarantee
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-green-400">
            © {new Date().getFullYear()} Acharya Ravinder Yoga. Built with love
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-200"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE BOTTOM BAR ───────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-hero px-4 pb-safe pt-2"
        data-ocid="mobile.sticky_bar"
      >
        <p className="text-center text-xs text-brand-muted mb-1.5">
          <Shield className="w-3 h-3 inline text-brand-green mr-1" />7 Day
          Guarantee
        </p>
        <button
          type="button"
          onClick={openModal}
          className="w-full bg-brand-green text-white font-poppins font-extrabold py-3.5 rounded-xl text-base shadow-green-glow hover:opacity-90 transition-opacity"
          data-ocid="mobile.sticky.primary_button"
        >
          Join 21 Day Challenge – ₹499
        </button>
        <div className="pb-2" />
      </div>

      {/* ── FLOATING WHATSAPP ─────────────────────────────────────────────── */}
      <a
        href="https://wa.me/911234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-8 right-4 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-green-glow transition-all group"
        data-ocid="floating.whatsapp.primary_button"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white fill-white" />
        <span className="absolute right-16 bg-white text-green-700 text-xs font-semibold px-2 py-1 rounded-lg shadow-card opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          WhatsApp
        </span>
      </a>
    </div>
  );
}
