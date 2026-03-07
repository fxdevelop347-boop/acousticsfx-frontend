"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

// ============ FADE IN ON SCROLL ============
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  className = "",
  once = true,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...directions[direction] }
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============ STAGGER CONTAINER ============
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============ STAGGER ITEM ============
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export function StaggerItem({
  children,
  className = "",
  direction = "up",
}: StaggerItemProps) {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...directions[direction] },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============ SCALE ON SCROLL ============
interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
}

export function ScaleOnScroll({
  children,
  className = "",
  once = true,
}: ScaleOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============ SLIDE IN ============
interface SlideInProps {
  children: ReactNode;
  direction?: "left" | "right";
  delay?: number;
  className?: string;
  once?: boolean;
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className = "",
  once = true,
}: SlideInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const xValue = direction === "left" ? -100 : 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xValue }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: xValue }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============ TEXT REVEAL ============
interface TextRevealProps {
  text: string;
  className?: string;
  once?: boolean;
}

export function TextReveal({
  text,
  className = "",
  once = true,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const words = text.split(" ");

  return (
    <motion.span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: i * 0.08,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ============ COUNTER ============
interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  suffix = "",
  className = "",
}: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration }}
        >
          {to}
          {suffix}
        </motion.span>
      )}
    </motion.span>
  );
}

// ============ HOVER SCALE ============
interface HoverScaleProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function HoverScale({
  children,
  scale = 1.05,
  className = "",
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============ BLUR IN ============
interface BlurInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}

export function BlurIn({
  children,
  delay = 0,
  className = "",
  once = true,
}: BlurInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={
        isInView
          ? { opacity: 1, filter: "blur(0px)" }
          : { opacity: 0, filter: "blur(10px)" }
      }
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

