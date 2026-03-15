import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity, Video, Music, LayoutDashboard, LogOut, Loader2,
  Heart, SkipBack, SkipForward, Play, Pause, MessageCircle, Info,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMusicPlayer } from "@/context/music-player";
import { cn } from "@/lib/utils";
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger,
} from "@/components/ui/sidebar";

interface LayoutProps { children: ReactNode }

const MOOD_COLORS: Record<string, string> = {
  Relaxed: "#1DB954",
  Normal: "#3B82F6",
  Excited: "#B026FF",
  Stressed: "#FF3366",
};

function NowPlayingBar() {
  const [location, setLocation] = useLocation();
  const { tracks, currentIndex, mood, isPlaying, playPause, next, prev } = useMusicPlayer();

  if (location === "/login" || location === "/signup") return null;
  if (!tracks.length) return null;

  const currentTrack = tracks[currentIndex];
  const color = MOOD_COLORS[mood] || "#00F0FF";

  return (
    <div className="h-16 border-t border-white/5 bg-black/70 backdrop-blur-xl flex items-center px-4 gap-3 flex-shrink-0">
      {/* Thumbnail */}
      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
        <img
          src={currentTrack?.thumbnail || `https://i.ytimg.com/vi/${currentTrack?.videoId}/default.jpg`}
          alt={currentTrack?.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Animated equalizer */}
      <div className="flex items-end gap-[2px] h-5 w-5 flex-shrink-0">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              backgroundColor: color,
              animation: isPlaying
                ? `eq-bar ${0.5 + i * 0.12}s ease-in-out infinite alternate`
                : "none",
              height: isPlaying ? "60%" : "25%",
            }}
          />
        ))}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate" style={{ color }}>
          {currentTrack?.title || `${mood} Mix`}
        </p>
        <p className="text-xs text-muted-foreground truncate">{currentTrack?.channelTitle}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={prev}
          className="p-1.5 rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={playPause}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{
            background: `linear-gradient(135deg, ${color}99, ${color}66)`,
            border: `1px solid ${color}40`,
          }}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" fill="white" /> : <Play className="w-3.5 h-3.5 ml-0.5" fill="white" />}
        </button>
        <button
          onClick={next}
          className="p-1.5 rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Go to music page */}
      <button
        onClick={() => setLocation(`/music?mood=${mood}`)}
        className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors"
        style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}
      >
        Open
      </button>
    </div>
  );
}

export function AppLayout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, logout, isLoading } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Scanner", href: "/scanner", icon: Video },
    { name: "Music", href: "/music", icon: Music },
  ];

  const infoLinks = [
    { name: "About Us", href: "/about", icon: Info },
    { name: "Contact Us", href: "/contact", icon: MessageCircle },
  ];

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const style = { "--sidebar-width": "16rem", "--sidebar-width-icon": "4rem" };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden relative">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/8 blur-[140px] rounded-full pointer-events-none" />

        {user && (
          <Sidebar className="border-r border-white/5 bg-[#0a0a14]/90 backdrop-blur-xl">
            <SidebarContent className="flex flex-col h-full">
              {/* Logo */}
              <div className="px-4 py-5 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Activity className="h-4 w-4 text-black" />
                  </div>
                  <span className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    PulseBeat
                  </span>
                </div>
              </div>

              {/* Nav */}
              <SidebarGroup className="flex-1 pt-4">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigation.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={location.startsWith(item.href)}>
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Info links */}
              <SidebarGroup className="pb-2 border-t border-white/5 pt-4">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {infoLinks.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={location === item.href}>
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* User footer */}
              <div className="p-4 border-t border-white/5">
                <div className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </SidebarContent>
          </Sidebar>
        )}

        <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden relative z-10">
          {/* Mobile header */}
          {user && (
            <header className="flex md:hidden items-center justify-between p-4 border-b border-white/5 bg-black/20 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Activity className="h-4 w-4 text-black" />
                </div>
                <span className="font-display font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  PulseBeat
                </span>
              </div>
              <SidebarTrigger className="text-foreground hover:bg-white/10 rounded-lg p-2" />
            </header>
          )}

          <main className="flex-1 overflow-y-auto p-4 md:p-8 min-w-0">
            {children}
          </main>

          {/* Now-playing bottom bar — persists across page navigation */}
          {user && <NowPlayingBar />}
        </div>
      </div>

      <style>{`
        @keyframes eq-bar {
          from { height: 25%; }
          to { height: 90%; }
        }
      `}</style>
    </SidebarProvider>
  );
}
