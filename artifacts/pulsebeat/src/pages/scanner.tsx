import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Activity, Heart, Wind, BrainCircuit, Music, RefreshCw } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useAnalyzeScan, ScanResult } from "@workspace/api-client-react";
import { LoadingPulse } from "@/components/ui/loading-pulse";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Scanner() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  
  const { videoRef, isStreaming, isRecording, progress, error, startStream, stopStream, recordVideo } = useCamera();
  const { mutateAsync: analyzeScan, isPending: isAnalyzing } = useAnalyzeScan();
  
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      setLocation("/login");
      return;
    }
    startStream();
    return () => stopStream();
  }, [isAuthenticated, isAuthLoading, startStream, stopStream, setLocation]);

  const handleStartScan = async () => {
    try {
      setResult(null);
      // Record 8 seconds
      const blob = await recordVideo(8000);
      
      // Analyze
      const data = await analyzeScan({ data: { video: blob } });
      setResult(data);
      
      toast({
        title: "Scan Complete",
        description: `Mood detected: ${data.mood}`,
      });
      
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Scan failed",
        description: err.message || "Failed to analyze video. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getMusic = () => {
    if (result) {
      setLocation(`/music?mood=${result.mood}`);
    }
  };

  if (isAuthLoading) return null;

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center pb-10">
      <div className="text-center mb-8 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Biometric Scan</h1>
        <p className="text-muted-foreground mt-2">Position your face in the frame and remain still for 8 seconds.</p>
      </div>

      {error && (
        <div className="w-full p-4 mb-6 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-center">
          {error}
        </div>
      )}

      <div className="relative w-full max-w-2xl aspect-video bg-black/60 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Camera Feed */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover scale-x-[-1]" 
        />

        {/* Not Streaming Overlay */}
        {!isStreaming && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <Activity className="h-10 w-10 text-muted-foreground animate-pulse" />
          </div>
        )}

        {/* Scan Reticle & Overlays */}
        <AnimatePresence>
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Corner brackets */}
              <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-xl animate-pulse" />
              <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-xl animate-pulse" />
              <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-xl animate-pulse" />
              <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-xl animate-pulse" />
              
              {/* Scanning laser line */}
              <motion.div 
                className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(0,240,255,1)]"
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Recording indicator */}
              <div className="absolute top-4 right-6 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white tracking-widest">REC</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar (Bottom Edge) */}
        {isRecording && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/50">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Analyzing Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center"
            >
              <LoadingPulse text="Processing Vitals..." />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-8 flex gap-4">
        {!isRecording && !isAnalyzing && !result && (
          <button
            onClick={handleStartScan}
            disabled={!isStreaming}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-black font-bold text-lg shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            <Video className="w-6 h-6" />
            Start Biometric Scan
          </button>
        )}
      </div>

      {/* Results Display */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <ResultCard title="Heart Rate" value={`${Math.round(result.heartRate)}`} unit="BPM" icon={<Heart className="text-[#FF3366]" />} color="border-[#FF3366]" delay={0.1} />
            <ResultCard title="Respiratory" value={`${Math.round(result.respiratoryRate)}`} unit="rpm" icon={<Wind className="text-cyan-400" />} color="border-cyan-400" delay={0.2} />
            <ResultCard title="HRV (SDNN)" value={`${Math.round(result.hrvSdnn || 0)}`} unit="ms" icon={<Activity className="text-accent" />} color="border-accent" delay={0.3} />
            <ResultCard title="Detected Mood" value={result.mood} unit="" icon={<BrainCircuit className="text-yellow-400" />} color="border-yellow-400" delay={0.4} highlight />

            <div className="col-span-full mt-6 flex justify-center gap-4">
              <button
                onClick={handleStartScan}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 font-medium"
              >
                <RefreshCw className="w-4 h-4" /> Rescan
              </button>
              <button
                onClick={getMusic}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-primary text-black font-bold shadow-[0_0_20px_rgba(176,38,255,0.4)] hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Music className="w-5 h-5" /> Get Music for {result.mood}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ title, value, unit, icon, color, delay, highlight = false }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className={`glass-panel p-6 rounded-2xl flex flex-col justify-between border-b-4 ${color} ${highlight ? 'bg-primary/5 shadow-[0_0_30px_rgba(0,240,255,0.15)]' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
      </div>
    </motion.div>
  );
}
