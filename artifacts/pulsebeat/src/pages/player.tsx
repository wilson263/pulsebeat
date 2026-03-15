import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Player() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const mood = sessionStorage.getItem("pb_mood") || "Normal";
    setLocation(`/music?mood=${mood}`);
  }, []);

  return null;
}
