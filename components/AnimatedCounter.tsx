"use client";

import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

type AnimatedCounterProps = {
  value: number;
};

export default function AnimatedCounter({ value }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.35,
    });

    return () => controls.stop();
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}