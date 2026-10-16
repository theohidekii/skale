import React, { useState, useEffect, useMemo, Children } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface LogosCarouselProps {
  children: React.ReactNode;
  count?: number;
  stagger?: number; // Delay in seconds between each logo animation (default: 0.14)
  className?: string; // Additional CSS classes for flex container
  duration?: number; // Animation duration in milliseconds (default: 600)
  interval?: number; // Time in milliseconds between carousel transitions (default: 2500)
  initialDelay?: number; // Initial delay in milliseconds before the animation starts (default: 500)
}

export const LogosCarousel: React.FC<LogosCarouselProps> = ({
  children,
  count,
  stagger = 0.14,
  className = '',
  duration = 600,
  interval = 2500,
  initialDelay = 500,
}) => {
  const childArray = useMemo(() => Children.toArray(children), [children]);

  // Group children based on count
  const groups = useMemo(() => {
    if (!count || count <= 0 || count >= childArray.length) {
      return [childArray];
    }
    const result: React.ReactNode[][] = [];
    for (let i = 0; i < childArray.length; i += count) {
      result.push(childArray.slice(i, i + count));
    }
    return result;
  }, [childArray, count]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (groups.length <= 1) return;

    // Handle initial delay before starting auto-cycling
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, initialDelay);

    return () => clearTimeout(startTimeout);
  }, [groups.length, initialDelay]);

  useEffect(() => {
    if (!hasStarted || groups.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % groups.length);
    }, interval);

    return () => clearInterval(timer);
  }, [hasStarted, groups.length, interval]);

  const currentGroup = groups[currentIndex] || [];
  const animDurationSec = duration / 1000;

  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap min-h-[64px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="flex items-center justify-center gap-8 md:gap-14 flex-wrap w-full"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {currentGroup.map((logo, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 18,
                    filter: 'blur(4px)',
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: {
                      duration: animDurationSec,
                      delay: idx * stagger,
                      ease: [0.16, 1, 0.3, 1], // Apple-style cubic curve
                    },
                  },
                  exit: {
                    opacity: 0,
                    y: -14,
                    filter: 'blur(4px)',
                    transition: {
                      duration: animDurationSec * 0.7,
                      delay: idx * (stagger * 0.6),
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className="flex items-center justify-center transition-opacity hover:opacity-100"
              >
                {logo}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
