import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingPulse({ text = "Processing Biometrics..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative">
        {/* Pulsing rings */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{ scale: [1, 2], opacity: [0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-accent"
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
        />
        
        {/* Center Icon */}
        <div className="relative h-20 w-20 bg-black/50 backdrop-blur-md rounded-full border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)]">
          <Activity className="h-10 w-10 text-primary animate-pulse" />
        </div>
      </div>
      
      <motion.p 
        className="mt-8 font-display font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {text.toUpperCase()}
      </motion.p>
    </div>
  );
}
