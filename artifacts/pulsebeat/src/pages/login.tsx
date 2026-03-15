import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, ArrowRight, Loader2, Eye, EyeOff, Mail, Phone, Volume2, VolumeX } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const emailSchema = z.object({
  loginId: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const phoneSchema = z.object({
  loginId: z.string().regex(/^\+?[1-9]\d{7,14}$/, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = { loginId: string; password: string };

function useAmbientMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    nodesRef.current.forEach((n) => { try { (n as OscillatorNode).stop?.(); } catch {} });
    nodesRef.current = [];
    ctxRef.current?.close();
    ctxRef.current = null;
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (ctxRef.current) { stop(); return; }
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
    master.connect(ctx.destination);

    const chords = [
      [130.81, 164.81, 196.00, 246.94],
      [110.00, 138.59, 164.81, 207.65],
      [123.47, 155.56, 185.00, 233.08],
      [116.54, 146.83, 174.61, 220.00],
    ];
    let time = ctx.currentTime;
    const chordDur = 4;
    const totalCycles = 32;

    for (let cycle = 0; cycle < totalCycles; cycle++) {
      const chord = chords[cycle % chords.length];
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, time);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.06 / chord.length, time + 0.3);
        gain.gain.setValueAtTime(0.06 / chord.length, time + chordDur - 0.3);
        gain.gain.linearRampToValueAtTime(0, time + chordDur);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start(time);
        osc.stop(time + chordDur);
        nodesRef.current.push(osc);
      });
      time += chordDur;
    }

    const noise = ctx.createOscillator();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();
    noise.type = "sawtooth";
    noise.frequency.setValueAtTime(40, ctx.currentTime);
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(120, ctx.currentTime);
    noiseGain.gain.setValueAtTime(0.015, ctx.currentTime);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();
    nodesRef.current.push(noise);

    setPlaying(true);
  }, [stop]);

  useEffect(() => () => { stop(); }, [stop]);

  return { playing, toggle: playing ? stop : play };
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<"email" | "phone">("email");
  const { playing, toggle: toggleMusic } = useAmbientMusic();

  const schema = loginMode === "email" ? emailSchema : phoneSchema;

  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { loginId: "", password: "" },
  });

  useEffect(() => {
    form.reset({ loginId: "", password: "" });
  }, [loginMode]);

  async function onSubmit(data: LoginForm) {
    try {
      await login({ data: { email: data.loginId, password: data.password } });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Deep space background"
          className="w-full h-full object-cover opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        {/* Animated equalizer bars in bg */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-1 opacity-10 pointer-events-none">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 rounded-t-sm bg-primary"
              style={{
                height: `${20 + Math.sin(i * 0.8) * 16 + Math.random() * 24}px`,
                animation: `eq-bar ${0.6 + (i % 5) * 0.15}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.04}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="absolute top-5 right-5 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:bg-white/15 transition-all"
        title={playing ? "Mute ambient music" : "Play ambient music"}
      >
        {playing ? <Volume2 className="h-4 w-4 text-primary animate-pulse" /> : <VolumeX className="h-4 w-4" />}
        <span className="hidden sm:inline">{playing ? "Music On" : "Music Off"}</span>
      </button>

      <div className="relative z-10 w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">

          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-105 transition-transform">
              <Activity className="h-8 w-8 text-black" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2 text-center text-sm">Enter your credentials to access your biometric dashboard.</p>
          </div>

          {/* Login mode tabs */}
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginMode("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                loginMode === "email"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMode("phone")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                loginMode === "phone"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="h-4 w-4" />
              Mobile
            </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="loginId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {loginMode === "email" ? "Email Address" : "Mobile Number"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={loginMode === "email" ? "email" : "tel"}
                        placeholder={loginMode === "email" ? "you@example.com" : "+1 234 567 8901"}
                        autoComplete={loginMode === "email" ? "email" : "tel"}
                        {...field}
                        className="bg-black/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary h-12 rounded-xl transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          {...field}
                          className="bg-black/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary h-12 rounded-xl transition-all pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </Form>

          <div className="mt-7 text-center text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
