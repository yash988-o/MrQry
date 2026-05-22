"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";
import { mockTestimonials } from "@/data/mockTestimonials";

// 5 copies of the array for a seamless loop buffer
// Total items = 5 * 7 = 35 items.
// Middle array is at index 2. Middle item is roughly index 17.
const MULTIPLIER = 5;
const loopData = Array(MULTIPLIER).fill(mockTestimonials).flat();

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(Math.floor(loopData.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Measure card width dynamically for responsive design
  const getCardTotalWidth = () => {
    if (typeof window === "undefined") return 344;
    return window.innerWidth < 768 ? 280 + 24 : 320 + 24; // width + gap-6 (24px)
  };

  // Callback ref to instantly set scroll position before the browser paints
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (node && !initialized.current) {
      containerRef.current = node;
      const centerItemIndex = Math.floor(loopData.length / 2);
      // Because padding-left perfectly centers the first item at scrollLeft = 0,
      // scrolling to item N is simply N * cardTotalWidth
      node.scrollLeft = centerItemIndex * getCardTotalWidth();
      initialized.current = true;
    }
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const node = containerRef.current;
    
    const cardTotalWidth = getCardTotalWidth();
    
    // Calculate which item is currently snapped to the center
    const currentIndex = Math.round(node.scrollLeft / cardTotalWidth);
    
    // Infinite Loop Logic - Optimized to preserve sub-pixel momentum!
    // We check the raw scrollLeft value to avoid snapping jitter.
    const oneArrayWidth = mockTestimonials.length * cardTotalWidth;
    
    let nextIndex = currentIndex;

    // The container has 5 arrays: [0, 1, 2, 3, 4]
    // If they scroll into array 0 (scrollLeft < oneArrayWidth)
    if (node.scrollLeft < oneArrayWidth) {
      // Teleport them 2 arrays forward (into array 2)
      node.scrollLeft += oneArrayWidth * 2;
      nextIndex = currentIndex + mockTestimonials.length * 2;
    } 
    // If they scroll past array 2 into array 3+ (scrollLeft > 3 * oneArrayWidth)
    else if (node.scrollLeft > oneArrayWidth * 3) {
      // Teleport them 2 arrays backward (into array 1)
      node.scrollLeft -= oneArrayWidth * 2;
      nextIndex = currentIndex - mockTestimonials.length * 2;
    }

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  };

  // The true active index for the dots
  const realActiveIndex = activeIndex % mockTestimonials.length;

  return (
    <section className="py-32 bg-bg-secondary relative border-y border-glass-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "0px" }}
            className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4"
          >
            What Learners Are Saying
          </motion.h2>
        </div>
      </div>

      {/* 
        Native CSS Scroll Container
        - overflow-x-auto allows trackpad scrolling
        - scroll-snap-type forces items to center
        - scrollbar-width: none hides the scrollbar
      */}
      <div 
        ref={setContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-6 pb-16 pt-8 hide-scroll-container"
        style={{ 
          scrollSnapType: 'x mandatory', 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          paddingLeft: "calc(50vw - 160px)", // 160px is half of 320px desktop card
          paddingRight: "calc(50vw - 160px)"
        }}
      >
        {/* Force hide scrollbar on WebKit browsers */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scroll-container::-webkit-scrollbar { display: none !important; }
          
          /* Responsive padding for mobile */
          @media (max-width: 768px) {
            .hide-scroll-container {
              padding-left: calc(50vw - 140px) !important;
              padding-right: calc(50vw - 140px) !important;
            }
          }
        `}} />

        {loopData.map((t, idx) => {
          const isCenter = idx === activeIndex;
          const isAdjacent = Math.abs(idx - activeIndex) === 1;
          
          let scale = 0.9;
          let opacity = 0.4;
          let borderClass = "border-glass-border";
          let zIndex = 0;
          
          if (isCenter) {
            scale = 1.08;
            opacity = 1;
            borderClass = "border-accent-active shadow-shadow-glow-violet";
            zIndex = 10;
          } else if (isAdjacent) {
            scale = 1;
            opacity = 1;
            zIndex = 5;
          }

          return (
            <motion.div
               key={`${t.id}-${idx}`}
               className="snap-center shrink-0 w-[280px] md:w-[320px]"
               animate={{ scale, opacity }}
               transition={{ duration: 0.4, ease: "easeOut" }}
               style={{ zIndex }}
            >
               <Card 
                  glass 
                  className={`w-full h-full flex flex-col justify-between p-8 transition-colors duration-500 min-h-[350px] select-none ${borderClass}`}
                >
                  <div>
                    <StarRating rating={t.rating} className="mb-6" />
                    <p className="text-text-primary text-base md:text-lg leading-relaxed mb-8 font-medium">
                      "{t.quote}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Avatar initials={t.initials} colorClass={t.avatarColor} />
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">{t.name}</h4>
                      <span className="text-xs text-text-muted">{t.role}</span>
                    </div>
                  </div>
               </Card>
            </motion.div>
          )
        })}
      </div>
      
      {/* Scroll Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {mockTestimonials.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${realActiveIndex === idx ? 'w-6 bg-accent-active' : 'w-1.5 bg-glass-border'}`}
          />
        ))}
      </div>
    </section>
  );
}
