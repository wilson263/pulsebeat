import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signup, isSigningUp } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(data: SignupForm) {
    try {
      await signup({ data });
      toast({ title: "Account created", description: "Welcome to PulseBeat!" });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Background"
          className="w-full h-full object-cover opacity-30 mix-blend-screen scale-x-[-1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">

          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(176,38,255,0.3)] hover:scale-105 transition-transform">
              <Activity className="h-8 w-8 text-black" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Join PulseBeat</h1>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              Start your journey into biometric-driven music experiences.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jane Doe"
                        autoComplete="name"
                        {...field}
                        className="bg-black/50 border-white/10 focus-visible:ring-accent focus-visible:border-accent h-12 rounded-xl transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...field}
                        className="bg-black/50 border-white/10 focus-visible:ring-accent focus-visible:border-accent h-12 rounded-xl transition-all"
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
                          autoComplete="new-password"
                          {...field}
                          className="bg-black/50 border-white/10 focus-visible:ring-accent focus-visible:border-accent h-12 rounded-xl transition-all pr-12"
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
                disabled={isSigningUp}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-accent to-primary text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(176,38,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {isSigningUp ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />Creating Account...</>
                ) : (
                  <>Sign Up <ArrowRight className="h-5 w-5" /></>
                )}
              </button>
            </form>
          </Form>

          <div className="mt-7 text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-accent font-bold hover:underline transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
