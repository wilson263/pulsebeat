import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface Track {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
}

interface MusicPlayerContextValue {
  tracks: Track[];
  currentIndex: number;
  mood: string;
  isPlaying: boolean;
  isPlayerReady: boolean;
  loadTracks: (tracks: Track[], index: number, mood: string) => void;
  playTrack: (index: number) => void;
  playPause: () => void;
  next: () => void;
  prev: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return ctx;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<any>(null);
  const pendingVideoRef = useRef<string | null>(null);
  const tracksRef = useRef<Track[]>([]);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mood, setMood] = useState("Normal");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [ytLoaded, setYtLoaded] = useState(false);

  tracksRef.current = tracks;

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setYtLoaded(true);
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      setYtLoaded(true);
      if (prev) prev();
    };
    if (!document.getElementById("yt-api-script")) {
      const tag = document.createElement("script");
      tag.id = "yt-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    if (!ytLoaded) return;
    let container = document.getElementById("yt-player-bg");
    if (!container) {
      container = document.createElement("div");
      container.id = "yt-player-bg";
      container.style.cssText =
        "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
      document.body.appendChild(container);

      const innerDiv = document.createElement("div");
      innerDiv.id = "yt-player-bg-inner";
      container.appendChild(innerDiv);
    }

    if (playerRef.current) return;

    playerRef.current = new window.YT.Player("yt-player-bg-inner", {
      videoId: "",
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
      },
      events: {
        onReady: () => {
          setIsPlayerReady(true);
          if (pendingVideoRef.current) {
            const vid = pendingVideoRef.current;
            pendingVideoRef.current = null;
            playerRef.current.loadVideoById(vid);
            setTimeout(() => {
              try { playerRef.current?.playVideo(); } catch {}
            }, 300);
          }
        },
        onStateChange: (e: any) => {
          const YT = window.YT;
          if (e.data === YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (
            e.data === YT.PlayerState.PAUSED ||
            e.data === YT.PlayerState.BUFFERING
          ) {
            setIsPlaying(false);
          } else if (e.data === YT.PlayerState.ENDED) {
            setIsPlaying(false);
            setCurrentIndex((prev) => {
              const t = tracksRef.current;
              if (!t.length) return prev;
              const next = (prev + 1) % t.length;
              const vid = t[next]?.videoId;
              if (vid && playerRef.current?.loadVideoById) {
                playerRef.current.loadVideoById(vid);
              }
              return next;
            });
          }
        },
      },
    });
  }, [ytLoaded]);

  const loadVideoById = useCallback((videoId: string) => {
    if (playerRef.current?.loadVideoById) {
      playerRef.current.loadVideoById(videoId);
      setTimeout(() => {
        try { playerRef.current?.playVideo(); } catch {}
      }, 300);
    } else {
      pendingVideoRef.current = videoId;
    }
  }, []);

  const loadTracks = useCallback(
    (newTracks: Track[], index: number, newMood: string) => {
      setTracks(newTracks);
      setCurrentIndex(index);
      setMood(newMood);
      tracksRef.current = newTracks;
      const videoId = newTracks[index]?.videoId;
      if (videoId) loadVideoById(videoId);
    },
    [loadVideoById]
  );

  const playTrack = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      const videoId = tracksRef.current[index]?.videoId;
      if (videoId) loadVideoById(videoId);
    },
    [loadVideoById]
  );

  const playPause = useCallback(() => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState?.();
    if (state === window.YT?.PlayerState?.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      const t = tracksRef.current;
      if (!t.length) return prev;
      const n = (prev + 1) % t.length;
      const vid = t[n]?.videoId;
      if (vid) loadVideoById(vid);
      return n;
    });
  }, [loadVideoById]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => {
      const t = tracksRef.current;
      if (!t.length) return prev;
      const p = (prev - 1 + t.length) % t.length;
      const vid = t[p]?.videoId;
      if (vid) loadVideoById(vid);
      return p;
    });
  }, [loadVideoById]);

  return (
    <MusicPlayerContext.Provider
      value={{
        tracks,
        currentIndex,
        mood,
        isPlaying,
        isPlayerReady,
        loadTracks,
        playTrack,
        playPause,
        next,
        prev,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}
