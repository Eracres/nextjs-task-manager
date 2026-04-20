"use client";

import { AnimatePresence, motion } from "framer-motion";

type ToastProps = {
  message: string;
  isVisible: boolean;
};

export default function Toast({ message, isVisible }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-purple-500/30 bg-zinc-950 px-5 py-3 text-sm text-white shadow-[0_0_25px_rgba(168,85,247,0.22)]"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}