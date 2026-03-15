import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  Music as MusicIcon,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music2,
} from "lucide-react";
import { useGetMusicRecommendations, GetMusicRecommendationsMood } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useMusicPlayer } from "@/context/music-player";

function BarVisualizer({ playing }: { playing: boolean }) {
  const bars = Array.from({ length: 32 });
  return (
    <div className="flex items-end justify-center gap-[3px] h-12 w-full">
      {bars.map((_, i) => {
        const height = 20 + Math.sin(i * 0.9) * 14 + ((i * 17) % 10);
        const delay = (i * 0.05).toFixed(2);
        return (
          <div
            key={i}
            className="flex-1 max-w-[6px] rounded-full bg-gradient-to-t from-primary/80 to-accent/80"
            style={{
              height: playing ? `${height}%` : "15%",
              transition: "height 0.3s ease",
              animation: playing
                ? `barPulse 0.8s ease-in-out ${delay}s infinite alternate`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}

function HeartbeatWaveform({ playing }: { playing: boolean }) {
  const points = [
    0, 0, 5, 0, 10, 0, 15, 0, 20, 0,
    22, -2, 24, -5, 26, 2, 28, -18, 30, 22, 32, -10, 34, 2, 36, 0,
    41, 0, 46, 0,
    48, -2, 50, -5, 52, 2, 54, -18, 56, 22, 58, -10, 60, 2, 62, 0,
    67, 0, 72, 0,
    74, -2, 76, -5, 78, 2, 80, -18, 82, 22, 84, -10, 86, 2, 88, 0,
    93, 0, 100, 0,
  ];
  const pathD = points.reduce((acc, val, i) => {
    if (i === 0) return `M ${val}`;
    if (i === 1) return `${acc} ${val}`;
    if (i % 2 === 0) return `${acc} L ${val}`;
    return `${acc} ${val}`;
  }, "");

  return (
    <svg
      viewBox="0 0 100 50"
      preserveAspectRatio="none"
      className="w-full h-10 opacity-40"
    >
      <defs>
        <linearGradient id="waveGradMusic" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b026ff" stopOpacity="0" />
          <stop offset="30%" stopColor="#b026ff" stopOpacity="1" />
          <stop offset="70%" stopColor="#00d4ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        stroke="url(#waveGradMusic)"
        strokeWidth="1.5"
        fill="none"
        style={{
          transform: "translateY(25px)",
          animation: playing ? "waveScroll 4s linear infinite" : "none",
        }}
      />
    </svg>
  );
}

export default function Music() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { tracks, currentIndex, mood: ctxMood, isPlaying, isPlayerReady, loadTracks, playTrack, playPause, next, prev } =
    useMusicPlayer();
  const trackListRef = useRef<HTMLDivElement>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const rawMood = searchParams.get("mood") || "Normal";
  const mood = rawMood as GetMusicRecommendationsMood;

  if (!isAuthLoading && !isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const { data, isLoading, error } = useGetMusicRecommendations({ mood }, {
    query: {
      enabled: isAuthenticated,
      retry: false,
    },
  });

  const loaded = useRef(false);
  useEffect(() => {
    if (data?.tracks && data.tracks.length > 0 && !loaded.current) {
      loaded.current = true;
      if (tracks.length === 0 || ctxMood !== mood) {
        loadTracks(data.tracks as any, 0, mood);
      }
    }
  }, [data]);

  const handleSelectTrack = (index: number) => {
    if (!data?.tracks) return;
    if (tracks.length === 0) {
      loadTracks(data.tracks as any, index, mood);
    } else {
      playTrack(index);
    }
  };

  const handlePlayAll = () => {
    if (!data?.tracks || data.tracks.length === 0) return;
    loadTracks(data.tracks as any, 0, mood);
  };

  const currentTrack = tracks[currentIndex];
  const displayTracks = data?.tracks ?? [];

  if (isAuthLoading || isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-12">
        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
          <div className="absolute inset-0 border-4 border-accent/20 rounded-full border-t-accent animate-spin" />
          <MusicIcon className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <p className="font-display text-xl font-bold animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Curating {mood} vibes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-destructive/20 text-destructive rounded-2xl flex items-center justify-center mb-4">
          <MusicIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Failed to load music</h2>
        <p className="text-muted-foreground">We couldn't get your recommendations. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes waveScroll {
          from { transform: translateY(25px) translateX(0); }
          to { transform: translateY(25px) translateX(100px); }
        }
        @keyframes barPulse {
          from { transform: scaleY(0.6); }
          to { transform: scaleY(1); }
        }
        .track-row {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.2s ease;
        }
        .track-row:hover, .track-row.active {
          background: rgba(176,38,255,0.12);
          border-color: rgba(176,38,255,0.3);
        }
        .player-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.09);
        }
        .control-btn { transition: all 0.15s ease; }
        .control-btn:hover { transform: scale(1.1); }
        .control-btn:active { transform: scale(0.95); }
      `}</style>

      <div className="flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Biometric Match
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold">
                Vibes for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {mood}
                </span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {data?.genre} · {displayTracks.length} tracks
              </p>
            </div>
            {displayTracks.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-bold"
                style={{
                  background: "linear-gradient(135deg, #b026ff, #00d4ff)",
                  boxShadow: "0 4px 20px rgba(176,38,255,0.4)",
                }}
              >
                <Play className="w-4 h-4" fill="white" />
                Play All
              </button>
            )}
          </div>
        </div>

        {/* Main layout: track list (left) + player card (right) */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* ── Track List (scrolls with the page) ── */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="space-y-2">
              {displayTracks.map((track, i) => {
                const isActive = currentTrack?.videoId === track.videoId && tracks.length > 0;
                return (
                  <button
                    key={`${track.videoId}-${i}`}
                    onClick={() => handleSelectTrack(i)}
                    className={`track-row w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 ${isActive ? "active" : ""}`}
                  >
                    <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={track.thumbnail || `https://i.ytimg.com/vi/${track.videoId}/default.jpg`}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                          {isPlaying ? (
                            <div className="flex gap-[2px] items-end h-4">
                              {[1, 2, 3].map((b) => (
                                <div
                                  key={b}
                                  className="w-[3px] bg-white rounded-full"
                                  style={{
                                    height: `${50 + b * 16}%`,
                                    animation: `barPulse 0.6s ease-in-out ${b * 0.15}s infinite alternate`,
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            <Play className="w-4 h-4 text-white" fill="white" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold line-clamp-1 ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {track.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{track.channelTitle}</p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground/50 font-mono">#{i + 1}</span>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                  </button>
                );
              })}

              {displayTracks.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <MusicIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No tracks found for this mood. Try rescanning.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Sticky Player Card (right on desktop, top on mobile) ── */}
          <div className="lg:w-80 flex-shrink-0 order-1 lg:order-2">
            <div className="lg:sticky lg:top-0 player-card rounded-2xl overflow-hidden">
              {currentTrack ? (
                <>
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={
                        currentTrack.thumbnail ||
                        `https://i.ytimg.com/vi/${currentTrack.videoId}/mqdefault.jpg`
                      }
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                      style={{
                        filter: isPlaying ? "brightness(0.9)" : "brightness(0.7)",
                        transition: "filter 0.3s ease",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Mood badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 border border-white/10 text-white">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                          style={{ backgroundColor: "#b026ff" }}
                        />
                        {mood.toUpperCase()} MOOD
                      </span>
                    </div>

                    {/* Track counter */}
                    <div className="absolute bottom-3 right-3 text-xs text-white/60 font-mono">
                      Track {currentIndex + 1} of {tracks.length}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h2 className="font-display font-bold text-base line-clamp-2 leading-tight mb-0.5">
                      {currentTrack.title}
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4">{currentTrack.channelTitle}</p>

                    {/* Waveform */}
                    <div className="mb-4">
                      <HeartbeatWaveform playing={isPlaying} />
                    </div>

                    {/* Bar visualizer */}
                    <div className="mb-5">
                      <BarVisualizer playing={isPlaying} />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-5">
                      <button
                        onClick={prev}
                        className="control-btn p-2.5 rounded-full text-muted-foreground hover:text-white hover:bg-white/10"
                      >
                        <SkipBack className="w-5 h-5" fill="currentColor" />
                      </button>

                      <button
                        onClick={playPause}
                        disabled={!isPlayerReady && tracks.length === 0}
                        className="control-btn w-14 h-14 rounded-full text-white disabled:opacity-40 flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #b026ff, #00d4ff)",
                          boxShadow: isPlaying
                            ? "0 0 30px rgba(176,38,255,0.6)"
                            : "0 4px 15px rgba(176,38,255,0.3)",
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" fill="white" />
                        ) : (
                          <Play className="w-6 h-6 ml-0.5" fill="white" />
                        )}
                      </button>

                      <button
                        onClick={next}
                        className="control-btn p-2.5 rounded-full text-muted-foreground hover:text-white hover:bg-white/10"
                      >
                        <SkipForward className="w-5 h-5" fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty state — no track loaded yet */
                <div className="flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 opacity-30"
                    style={{ background: "linear-gradient(135deg, #b026ff, #00d4ff)" }}
                  >
                    <Music2 className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground">Select a track to start playing</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
