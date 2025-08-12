"use client";
import React, { useRef, useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

export const CometCard = ({
  rotateDepth = 10,
  translateDepth = 10,
  className,
  children,
  disable3D = false,
}: {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
  disable3D?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Use will-change for better performance
  const springConfig = { 
    damping: 30, 
    stiffness: 200, 
    mass: 0.5 
  };

  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`]
  );
  
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`]
  );

  const translateX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`]
  );
  
  const translateY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`]
  );

  const glareBackground = useMotionTemplate`radial-gradient(
    400px circle at ${x}px ${y}px,
    rgba(255, 255, 255, 0.1),
    transparent 40%
  )`;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disable3D || isMobile) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalize mouse position to -0.5 to 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Update motion values
    x.set(mouseX);
    y.set(mouseY);
  }, [x, y, disable3D, isMobile]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Smoothly return to center
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  // Disable hover effect on mobile
  if (isMobile || disable3D) {
    return (
      <div className={cn("h-full w-full", className)}>
        {children}
      </div>
    );
  }

  return (
    <div 
      className={cn("perspective-distant transform-3d h-full w-full", className)} 
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      <motion.div
        className="h-full w-full"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          translateX: isHovered ? translateX : 0,
          translateY: isHovered ? translateY : 0,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div className="h-full w-full" style={{ transform: 'translateZ(0)' }}>
          {children}
        </div>
        {isHovered && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 rounded-xl opacity-0 transition-opacity duration-300"
            style={{
              background: glareBackground,
              opacity: isHovered ? 1 : 0,
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              willChange: 'opacity'
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
