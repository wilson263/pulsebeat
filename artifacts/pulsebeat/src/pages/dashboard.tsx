import { useLocation } from "wouter";
import { format, formatDistanceToNow } from "date-fns";
import {
  Heart, Wind, Scan, BrainCircuit, Play, Clock, TrendingUp,
  Music2, Headphones, Radio, Zap, ChevronRight, Activity
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area
} from "recharts";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const MOOD_COLORS: Record<string, string> = {
  Relaxed: "#1DB954",
  Normal: "#3B82F6",
  Excited: "#B026FF",
  Stressed: "#FF3366",
};

const MOOD_GRADIENTS: Record<string, string> = {
  Relaxed: "from-green-500/30 to-green-900/10",
  Normal: "from-blue-500/30 to-blue-900/10",
  Excited: "from-purple-500/30 to-purple-900/10",
  Stressed: "from-rose-500/30 to-rose-900/10",
};

const MOOD_ICONS: Record<string, React.ReactNode> = {
  Relaxed: <Music2 className="h-6 w-6" />,
  Normal: <Radio className="h-6 w-6" />,
  Excited: <Zap className="h-6 w-6" />,
  Stressed: <Headphones className="h-6 w-6" />,
};

const MOOD_GENRE: Record<string, string> = {
  Relaxed: "Lo-fi & Meditation",
  Normal: "Chill Pop",
  Excited: "Upbeat EDM",
  Stressed: "Calming Instrumental",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  if (!isAuthLoading && !isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const { data: stats, isLoading } = useGetDashboardStats({
    query: { enabled: isAuthenticated, retry: false }
  });

  if (isLoading || isAuthLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full border-t-primary animate-spin" />
            <Activity className="absolute inset-0 m-auto h-7 w-7 text-primary" />
          </div>
          <p className="text-muted-foreground animate-pulse">Loading your pulse...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const pieData = Object.entries(stats.moodDistribution || {}).map(([name, value]) => ({
    name, value: value as number, color: MOOD_COLORS[name] || "#FFFFFF"
  }));
  const dominantMood = pieData.sort((a, b) => b.value - a.value)[0]?.name || "Normal";
  const totalScans = stats.totalScans || 0;

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-8">

      {/* ── Hero greeting banner (Spotify-style) ── */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden p-8 bg-gradient-to-r",
          MOOD_GRADIENTS[dominantMood] || "from-primary/20 to-accent/10"
        )}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-white/60 uppercase tracking-widest mb-1">
              {getGreeting()}, {user?.name?.split(" ")[0] || "there"} 👋
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-2">
              Your Biometric Mix
            </h1>
            <p className="text-white/60 text-sm">
              {totalScans > 0
                ? `${totalScans} scan${totalScans !== 1 ? "s" : ""} analyzed · Dominant mood: ${dominantMood} · Genre: ${MOOD_GENRE[dominantMood]}`
                : "Complete your first scan to see your personalized biometric music profile"}
            </p>
          </div>
          <button
            onClick={() => setLocation(`/music?mood=${dominantMood}`)}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary text-black font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,240,255,0.4)] self-start md:self-auto whitespace-nowrap"
          >
            <Play className="h-5 w-5 fill-black" />
            Play Mood Mix
          </button>
        </div>
        {/* Big abstract waveform decoration */}
        <div className="absolute right-0 top-0 h-full w-64 opacity-10 pointer-events-none flex items-end gap-1 pr-6 pb-4">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-white rounded-t-sm"
              style={{ height: `${30 + Math.sin(i * 0.7) * 25 + (i % 3) * 10}%` }}
            />
          ))}
        </div>
      </div>

      {/* ── Spotify-style quick-stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Scans",
            value: totalScans,
            sub: "sessions",
            icon: <Scan className="h-5 w-5" />,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Avg Heart Rate",
            value: `${Math.round(stats.averageHeartRate || 0)}`,
            sub: "BPM",
            icon: <Heart className="h-5 w-5" />,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
          },
          {
            label: "Avg Resp Rate",
            value: `${Math.round(stats.averageRespiratoryRate || 0)}`,
            sub: "breaths/min",
            icon: <Wind className="h-5 w-5" />,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
          },
          {
            label: "Dominant Mood",
            value: dominantMood,
            sub: MOOD_GENRE[dominantMood] || "—",
            icon: MOOD_ICONS[dominantMood] || <BrainCircuit className="h-5 w-5" />,
            color: `text-[${MOOD_COLORS[dominantMood]}]`,
            bg: "bg-white/5",
          },
        ].map((card, i) => (
          <div key={i} className="glass-panel rounded-xl p-5 flex items-center gap-4 hover-elevate">
            <div className={cn("p-2.5 rounded-xl", card.bg)}>
              <span className={card.color}>{card.icon}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-muted-foreground truncate">{card.label}</p>
              <p className="font-display font-bold text-xl text-foreground truncate">{card.value}</p>
              <p className="text-xs text-muted-foreground truncate">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Heart Rate Area Chart (Spotify-style trend) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg">Heart Rate Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Your pulse over time</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Last {stats.heartRateTrend?.length || 0} scans
            </div>
          </div>
          <div className="h-[240px] w-full">
            {(stats.heartRateTrend?.length || 0) > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.heartRateTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#ffffff30" tick={{ fontSize: 11, fill: "#ffffff50" }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff30" tick={{ fontSize: 11, fill: "#ffffff50" }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#0d0d1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "12px" }}
                    itemStyle={{ color: "#00F0FF" }}
                    labelStyle={{ color: "#ffffff80" }}
                    formatter={(val: any) => [`${val} BPM`, "Heart Rate"]}
                  />
                  <Area type="monotone" dataKey="heartRate" stroke="#00F0FF" strokeWidth={2.5} fill="url(#hrGrad)" dot={false} activeDot={{ r: 5, fill: "#00F0FF", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Activity className="h-10 w-10 opacity-20" />
                <p className="text-sm">No scan data yet. Complete a scan to see your trend.</p>
                <button onClick={() => setLocation("/scanner")} className="text-xs text-primary hover:underline">
                  Start scanning →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mood Breakdown — Spotify "top genres" style */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="mb-5">
            <h3 className="font-display font-bold text-lg">Mood Breakdown</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Your emotional states</p>
          </div>
          <div className="space-y-3">
            {pieData.length > 0 ? pieData.map((entry) => {
              const pct = totalScans > 0 ? Math.round((entry.value / totalScans) * 100) : 0;
              return (
                <div key={entry.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm font-medium">{entry.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{entry.value}×</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: entry.color }}
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-muted-foreground text-sm opacity-60">
                No mood data yet
              </div>
            )}
          </div>

          {pieData.length > 0 && (
            <button
              onClick={() => setLocation(`/music?mood=${dominantMood}`)}
              className="w-full mt-6 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" />
              Play {dominantMood} Mix
            </button>
          )}
        </div>
      </div>

      {/* ── Recent Scans — Spotify "recently played" style ── */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-lg">Recent Sessions</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Your latest biometric scans</p>
          </div>
          <button
            onClick={() => setLocation("/scanner")}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
          >
            New scan <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {(stats.recentScans?.length || 0) > 0 ? (
          <div className="space-y-1">
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-3 pb-2 border-b border-white/5 text-xs text-muted-foreground uppercase tracking-wide">
              <span className="w-8 text-center">#</span>
              <span>Mood</span>
              <span className="text-right hidden sm:block">Heart Rate</span>
              <span className="text-right hidden md:block">Resp. Rate</span>
              <span className="text-right hidden md:block">HRV</span>
              <span className="text-right"><Clock className="h-3.5 w-3.5 inline" /></span>
            </div>

            {stats.recentScans.slice(0, 8).map((scan, i) => {
              const color = MOOD_COLORS[scan.mood] || "#fff";
              return (
                <div
                  key={scan.id}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-3 py-3 rounded-lg hover:bg-white/5 transition-colors group cursor-default"
                >
                  {/* Index / Play icon */}
                  <div className="w-8 text-center">
                    <span className="text-sm text-muted-foreground group-hover:hidden">{i + 1}</span>
                    <Play className="h-4 w-4 text-primary fill-primary hidden group-hover:block mx-auto" />
                  </div>

                  {/* Mood "album" cell */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center text-black"
                      style={{ backgroundColor: color }}
                    >
                      {MOOD_ICONS[scan.mood]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color }}>
                        {scan.mood}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{MOOD_GENRE[scan.mood]}</p>
                    </div>
                  </div>

                  {/* Heart Rate */}
                  <div className="text-right hidden sm:block">
                    <span className="font-mono text-sm text-rose-400 font-bold">
                      {Math.round(scan.heartRate)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">BPM</span>
                  </div>

                  {/* Resp Rate */}
                  <div className="text-right hidden md:block">
                    <span className="font-mono text-sm text-cyan-400">
                      {Math.round(scan.respiratoryRate)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">rpm</span>
                  </div>

                  {/* HRV */}
                  <div className="text-right hidden md:block">
                    <span className="font-mono text-sm text-accent">
                      {scan.hrvSdnn ? `${Math.round(scan.hrvSdnn)}ms` : "—"}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <Headphones className="h-8 w-8 text-muted-foreground opacity-40" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No sessions yet</p>
              <p className="text-sm text-muted-foreground mt-1">Complete a biometric scan to start your health music journey</p>
            </div>
            <button
              onClick={() => setLocation("/scanner")}
              className="mt-2 px-6 py-2.5 rounded-full bg-primary text-black font-bold text-sm hover:scale-105 transition-transform"
            >
              Start Your First Scan
            </button>
          </div>
        )}
      </div>

      {/* ── Mood-to-genre quick picks ── */}
      <div>
        <h3 className="font-display font-bold text-lg mb-4">Browse by Mood</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["Relaxed", "Normal", "Excited", "Stressed"] as const).map((mood) => (
            <button
              key={mood}
              onClick={() => setLocation(`/music?mood=${mood}`)}
              className={cn(
                "relative overflow-hidden rounded-xl p-5 text-left group hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 bg-gradient-to-br",
                MOOD_GRADIENTS[mood]
              )}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10">
                <div className="mb-3" style={{ color: MOOD_COLORS[mood] }}>
                  {MOOD_ICONS[mood]}
                </div>
                <p className="font-bold text-sm text-white">{mood}</p>
                <p className="text-xs text-white/60 mt-0.5">{MOOD_GENRE[mood]}</p>
              </div>
              <Play
                className="absolute bottom-4 right-4 h-8 w-8 fill-black text-black opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-1.5"
                style={{ backgroundColor: MOOD_COLORS[mood] }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
