import {
  Activity, Heart, Music2, Zap, Shield, Camera, BrainCircuit,
  Radio, Headphones, Star, Github, Globe, Lock, ExternalLink
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const CURRENT_YEAR = new Date().getFullYear();
const APP_VERSION = "1.0.0";

const features = [
  {
    icon: <Camera className="h-5 w-5" />,
    title: "Facial Biometric Scanning",
    desc: "Uses your device camera and rPPG (remote photoplethysmography) to non-invasively measure physiological signals from subtle color changes in your skin.",
    color: "#00F0FF",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Real-Time Vital Signs",
    desc: "Powered by VitalLens AI, PulseBeat estimates your heart rate, respiratory rate, and heart rate variability (HRV) from a short 8-second face scan.",
    color: "#FF3366",
  },
  {
    icon: <BrainCircuit className="h-5 w-5" />,
    title: "Mood Classification Engine",
    desc: "Physiological signals are mapped to emotional states — Relaxed, Normal, Excited, or Stressed — using a rule-based biometric classification model.",
    color: "#B026FF",
  },
  {
    icon: <Music2 className="h-5 w-5" />,
    title: "Biometric Music Matching",
    desc: "Your detected mood is matched to the perfect genre: lo-fi for calm, chill pop for balance, EDM for energy, and calming instrumentals for stress relief.",
    color: "#1DB954",
  },
  {
    icon: <Radio className="h-5 w-5" />,
    title: "YouTube Music Integration",
    desc: "PulseBeat searches YouTube in real-time for the best mood-matched tracks and serves them directly in the app — no extra subscription required.",
    color: "#FF0000",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Privacy-First Design",
    desc: "Video recordings are processed server-side and permanently deleted after analysis. No biometric data is stored beyond your session results.",
    color: "#F59E0B",
  },
];

const techStack = [
  { name: "React + Vite", role: "Frontend framework", color: "#61DAFB" },
  { name: "TypeScript", role: "Type-safe codebase", color: "#3178C6" },
  { name: "FastAPI / Express", role: "Backend API", color: "#009688" },
  { name: "VitalLens API", role: "rPPG biometrics", color: "#00F0FF" },
  { name: "YouTube Data API v3", role: "Music discovery", color: "#FF0000" },
  { name: "PostgreSQL + Drizzle", role: "Database & ORM", color: "#336791" },
  { name: "JWT + bcrypt", role: "Secure authentication", color: "#F59E0B" },
  { name: "Recharts", role: "Data visualization", color: "#B026FF" },
  { name: "Tailwind CSS", role: "UI styling", color: "#06B6D4" },
  { name: "Web Audio API", role: "Ambient music generation", color: "#1DB954" },
];

const team = [
  { name: "PulseBeat Team", role: "Product & Engineering", initial: "P", color: "#00F0FF" },
  { name: "VitalLens", role: "Biometric AI Partner", initial: "V", color: "#FF3366" },
  { name: "Open Source Community", role: "Libraries & Tooling", initial: "O", color: "#1DB954" },
];

export default function About() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-10">

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden p-10 bg-gradient-to-br from-primary/20 via-accent/10 to-background border border-white/5">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, rgba(0,240,255,0.6) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(176,38,255,0.6) 0%, transparent 60%)"
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.4)] flex-shrink-0">
            <Activity className="h-10 w-10 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                PulseBeat
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-xs font-mono text-muted-foreground">
                v{APP_VERSION}
              </span>
            </div>
            <p className="text-lg text-foreground/80 font-medium">
              AI-Powered Biometric Music Platform
            </p>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              PulseBeat bridges the gap between your body and your music. By reading your physiological signals through the camera, it understands how you truly feel and picks the perfect soundtrack for that moment — automatically, in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Mission statement */}
      <div className="glass-panel rounded-2xl p-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 mb-2">
          <Star className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Our Mission</span>
        </div>
        <p className="font-display text-2xl font-bold text-foreground max-w-3xl mx-auto">
          "Music should feel what you feel — not what you tell it to."
        </p>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          We built PulseBeat to eliminate the friction between your emotional state and your music experience. No mood logging, no playlist searching — just your face, your vitals, and the right music.
        </p>
      </div>

      {/* Features */}
      <div>
        <div className="mb-5">
          <h2 className="font-display font-bold text-2xl text-foreground">How It Works</h2>
          <p className="text-muted-foreground text-sm mt-1">The technology behind PulseBeat</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="glass-panel rounded-xl p-5 space-y-3 hover:scale-[1.01] transition-transform">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-black"
                style={{ backgroundColor: f.color }}
              >
                {f.icon}
              </div>
              <p className="font-semibold text-sm text-foreground">{f.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="mb-5">
          <h2 className="font-display font-bold text-xl text-foreground">Technology Stack</h2>
          <p className="text-muted-foreground text-sm mt-1">Built with modern, production-grade technologies</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tech.color }}
              />
              <p className="text-xs font-bold text-foreground leading-tight">{tech.name}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{tech.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="mb-5">
          <h2 className="font-display font-bold text-xl text-foreground">Credits</h2>
          <p className="text-muted-foreground text-sm mt-1">The people and projects that made this possible</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {team.map((member) => (
            <div key={member.name} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: member.color }}
              >
                {member.initial}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-amber-400" />
          </div>
          <h2 className="font-display font-bold text-xl">Privacy & Security</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
          {[
            "Video recordings are deleted from our servers immediately after biometric analysis — we never store raw footage.",
            "All biometric results (heart rate, mood, HRV) are stored encrypted and linked only to your account.",
            "Passwords are hashed using bcrypt — we never store or see your plain-text password.",
            "Session tokens are signed JWT cookies with a 7-day expiry. All API communication is over HTTPS.",
            "Camera access requires explicit user permission and is only active during the scanning session.",
            "We do not sell, share, or transfer your biometric or personal data to any third parties.",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright footer card */}
      <div className="rounded-2xl border border-white/5 bg-black/30 p-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Activity className="h-4 w-4 text-black" />
          </div>
          <span className="font-display font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            PulseBeat
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {CURRENT_YEAR} PulseBeat. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/60 max-w-xl mx-auto">
          PulseBeat is a proprietary AI health and music application. The biometric scanning technology is powered by VitalLens (Rouast &amp; Co). Music content is sourced via the YouTube Data API v3 in compliance with YouTube's Terms of Service. All trademarks and logos belong to their respective owners.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          {[
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Contact Us", href: "/contact" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/40 pt-1">
          App Version {APP_VERSION} · Built with ♥ using React, TypeScript, and FastAPI
        </p>
      </div>
    </div>
  );
}
