import { Router, type IRouter } from "express";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

const MOOD_GENRES: Record<string, { genre: string; queries: string[] }> = {
  Relaxed: {
    genre: "Lo-fi / Meditation",
    queries: [
      "lofi hip hop chill beats",
      "meditation ambient music",
      "relaxing piano music",
      "sleep music relaxing",
      "lofi study music playlist",
      "ambient chill music mix"
    ]
  },
  Normal: {
    genre: "Chill Pop",
    queries: [
      "chill pop playlist 2024",
      "feel good indie pop",
      "chill vibes playlist",
      "happy pop music mix",
      "positive energy music",
      "feel good songs playlist"
    ]
  },
  Excited: {
    genre: "Upbeat EDM",
    queries: [
      "upbeat EDM workout",
      "energetic dance music 2024",
      "high energy electronic music",
      "best gym music mix",
      "motivational music playlist",
      "pump up music mix"
    ]
  },
  Stressed: {
    genre: "Calming Instrumental",
    queries: [
      "calming instrumental music",
      "stress relief piano",
      "peaceful nature sounds music",
      "anxiety relief music",
      "healing meditation music",
      "soft acoustic guitar relaxing"
    ]
  }
};

const FALLBACK_TRACKS: Record<string, { videoId: string; title: string; channelTitle: string; thumbnail: string }[]> = {
  Relaxed: [
    { videoId: "jfKfPfyJRdk", title: "lofi hip hop radio - beats to relax/study to", channelTitle: "Lofi Girl", thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg" },
    { videoId: "5qap5aO4i9A", title: "lofi hip hop radio - beats to sleep/chill to", channelTitle: "Lofi Girl", thumbnail: "https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg" },
    { videoId: "rUxyKA_-grg", title: "Chillhop Radio - jazzy & lofi beats", channelTitle: "Chillhop Music", thumbnail: "https://i.ytimg.com/vi/rUxyKA_-grg/mqdefault.jpg" },
    { videoId: "DWcJFNfaw9c", title: "Peaceful Piano - Relaxing Music", channelTitle: "Yellow Brick Cinema", thumbnail: "https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg" },
    { videoId: "1ZYbU82GVz4", title: "Relaxing Jazz Music - Smooth Jazz", channelTitle: "Relaxing Music", thumbnail: "https://i.ytimg.com/vi/1ZYbU82GVz4/mqdefault.jpg" },
    { videoId: "77ZozI0rw7w", title: "Calm Music for Sleeping - Relaxing Piano", channelTitle: "Soothing Relaxation", thumbnail: "https://i.ytimg.com/vi/77ZozI0rw7w/mqdefault.jpg" },
  ],
  Normal: [
    { videoId: "ktvTqknDobU", title: "Feel Good Indie Pop Mix", channelTitle: "The Sound You Need", thumbnail: "https://i.ytimg.com/vi/ktvTqknDobU/mqdefault.jpg" },
    { videoId: "36YnV9STBqc", title: "Chill Vibes Music Mix", channelTitle: "ChillVibes", thumbnail: "https://i.ytimg.com/vi/36YnV9STBqc/mqdefault.jpg" },
    { videoId: "b8UaOFOAWEI", title: "Good Vibes Music - Positive & Happy Songs", channelTitle: "Good Vibes", thumbnail: "https://i.ytimg.com/vi/b8UaOFOAWEI/mqdefault.jpg" },
    { videoId: "G4-WBMgHbLo", title: "Chill Pop Songs Mix 2024", channelTitle: "Chill Nation", thumbnail: "https://i.ytimg.com/vi/G4-WBMgHbLo/mqdefault.jpg" },
    { videoId: "4qQyUq7kpxE", title: "Indie Pop Mix - Morning Mood", channelTitle: "Indie Pop", thumbnail: "https://i.ytimg.com/vi/4qQyUq7kpxE/mqdefault.jpg" },
    { videoId: "09R8_2nJtjg", title: "Summer Chill Mix 2024", channelTitle: "Summer Vibes", thumbnail: "https://i.ytimg.com/vi/09R8_2nJtjg/mqdefault.jpg" },
  ],
  Excited: [
    { videoId: "y6Sxv-sUYtM", title: "NCS: Best of 2024 (Gaming Music Mix)", channelTitle: "NoCopyrightSounds", thumbnail: "https://i.ytimg.com/vi/y6Sxv-sUYtM/mqdefault.jpg" },
    { videoId: "gCYcHz2k5x0", title: "Workout Music Mix 2024 - Best EDM", channelTitle: "Workout Music", thumbnail: "https://i.ytimg.com/vi/gCYcHz2k5x0/mqdefault.jpg" },
    { videoId: "p7YXXieghto", title: "Energetic Dance Music Mix", channelTitle: "EDM Nation", thumbnail: "https://i.ytimg.com/vi/p7YXXieghto/mqdefault.jpg" },
    { videoId: "hHW1oY26kxQ", title: "High Energy EDM Mix - Best Electronic Music", channelTitle: "EDM Mix", thumbnail: "https://i.ytimg.com/vi/hHW1oY26kxQ/mqdefault.jpg" },
    { videoId: "7wtfhZwyrcc", title: "Best Electro House Mix 2024", channelTitle: "House Nation", thumbnail: "https://i.ytimg.com/vi/7wtfhZwyrcc/mqdefault.jpg" },
    { videoId: "uelHwf8o7_U", title: "Festival EDM Mix 2024", channelTitle: "Festival Vibes", thumbnail: "https://i.ytimg.com/vi/uelHwf8o7_U/mqdefault.jpg" },
  ],
  Stressed: [
    { videoId: "lFcSrYw2ARk", title: "Calm Piano Music for Stress Relief", channelTitle: "Relaxing Music", thumbnail: "https://i.ytimg.com/vi/lFcSrYw2ARk/mqdefault.jpg" },
    { videoId: "hlWiI4xVXKY", title: "Nature Sounds for Sleep and Relaxation", channelTitle: "Nature Healing", thumbnail: "https://i.ytimg.com/vi/hlWiI4xVXKY/mqdefault.jpg" },
    { videoId: "2OEL4P1Rz04", title: "Calming Music for Anxiety Relief", channelTitle: "Calming Music", thumbnail: "https://i.ytimg.com/vi/2OEL4P1Rz04/mqdefault.jpg" },
    { videoId: "FjHGZj2IjBk", title: "Healing Music for The Body and Soul", channelTitle: "Healing Energy", thumbnail: "https://i.ytimg.com/vi/FjHGZj2IjBk/mqdefault.jpg" },
    { videoId: "aXItOY0sLRY", title: "Peaceful Acoustic Guitar Music", channelTitle: "Guitar Relaxation", thumbnail: "https://i.ytimg.com/vi/aXItOY0sLRY/mqdefault.jpg" },
    { videoId: "1vx8iUvfyCY", title: "Stress Relief Music - 3 Hours Calming", channelTitle: "Soothing Relaxation", thumbnail: "https://i.ytimg.com/vi/1vx8iUvfyCY/mqdefault.jpg" },
  ]
};

router.get("/recommendations", requireAuth, async (req, res) => {
  const mood = req.query["mood"] as string;
  if (!mood || !MOOD_GENRES[mood]) {
    res.status(400).json({ error: "Bad Request", message: "Invalid mood parameter" });
    return;
  }

  const moodConfig = MOOD_GENRES[mood];
  const apiKey = process.env["GOOGLE_API_KEY"] || process.env["YOUTUBE_API_KEY"];

  if (!apiKey) {
    console.log("No API key set — returning curated fallback tracks");
    const tracks = FALLBACK_TRACKS[mood].map(t => ({ ...t, duration: "" }));
    res.json({ mood, genre: moodConfig.genre, tracks });
    return;
  }

  try {
    const fetchQuery = async (query: string) => {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("q", query);
      url.searchParams.set("type", "video");
      url.searchParams.set("videoCategoryId", "10");
      url.searchParams.set("maxResults", "50");
      url.searchParams.set("key", apiKey);
      const response = await fetch(url.toString());
      if (!response.ok) {
        const errBody = await response.text();
        console.error("YouTube API error:", errBody);
        return [];
      }
      const data = await response.json() as any;
      return (data.items || []).map((item: any) => ({
        videoId: item.id?.videoId || "",
        title: item.snippet?.title || "",
        channelTitle: item.snippet?.channelTitle || "",
        thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || "",
        duration: ""
      })).filter((t: any) => t.videoId);
    };

    const results = await Promise.all(moodConfig.queries.map(fetchQuery));
    const seen = new Set<string>();
    const tracks = results.flat().filter((t: any) => {
      if (seen.has(t.videoId)) return false;
      seen.add(t.videoId);
      return true;
    });

    if (tracks.length === 0) {
      const fallback = FALLBACK_TRACKS[mood].map(t => ({ ...t, duration: "" }));
      res.json({ mood, genre: moodConfig.genre, tracks: fallback });
      return;
    }

    res.json({ mood, genre: moodConfig.genre, tracks });
  } catch (err) {
    console.error("Music recommendations error:", err);
    const tracks = FALLBACK_TRACKS[mood].map(t => ({ ...t, duration: "" }));
    res.json({ mood, genre: moodConfig.genre, tracks });
  }
});

export default router;
