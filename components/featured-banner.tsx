"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Media } from "@/types"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { WatchlistButton } from "@/components/watchlist-button"

interface FeaturedBannerProps {
  mediaList: Media[]
}

// Sub-component: Mini Card (Stacked in columns, showing only cover)
function BannerMiniCard({ media, priority = false }: { media: Media; priority?: boolean }) {
  return (
    <Link href={`/media/${media.id}`} className="flex-1 relative w-full h-[calc(50%-6px)] md:h-[calc(50%-8px)] rounded-sm overflow-hidden group border border-white/5 hover:border-jade/30 transition-all select-none">
      <Image
        src={media.coverImage}
        alt={`Cover image for ${media.title}`}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        sizes="(max-w-768px) 33vw, (max-w-1024px) 20vw, 150px"
        priority={priority}
      />

      {/* Mini bookmark indicator */}
      <WatchlistButton
        mediaId={media.id}
        iconSize={12}
        className="absolute top-1.5 right-1.5 size-6 opacity-0 group-hover:opacity-100 transition-all"
      />
    </Link>
  )
}

// Sub-component: Large Card (Showing only cover)
function BannerLargeCard({ media, priority = false }: { media: Media; priority?: boolean }) {
  return (
    <Link href={`/media/${media.id}`} className="block relative w-full h-full rounded-sm overflow-hidden group border border-white/5 hover:border-jade/30 transition-all select-none">
      <Image
        src={media.coverImage}
        alt={`Cover image for ${media.title}`}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        sizes="(max-w-768px) 50vw, (max-w-1024px) 33vw, 250px"
        priority={priority}
      />

      {/* Bookmark button */}
      <WatchlistButton
        mediaId={media.id}
        iconSize={14}
        className="absolute top-2.5 right-2.5 size-8 opacity-0 group-hover:opacity-100 transition-all hover:border-white/20"
      />
    </Link>
  )
}

export function FeaturedBanner({ mediaList }: FeaturedBannerProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Chunk mediaList into slides of 8 items each
  const slides = React.useMemo(() => {
    const list: Media[][] = []
    for (let i = 0; i < mediaList.length; i += 8) {
      const slice = mediaList.slice(i, i + 8)
      if (slice.length === 8) {
        list.push(slice)
      }
    }
    return list
  }, [mediaList])

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Autoplay hook
  useEffect(() => {
    if (isPlaying && slides.length > 1) {
      timerRef.current = setInterval(nextSlide, 6000)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, nextSlide, slides.length])

  if (slides.length === 0) return null

  const currentSlideItems = slides[activeSlide]

  return (
    <div
      className="relative group/banner w-full bg-void overflow-hidden flex items-center min-h-[320px] md:min-h-[380px] lg:min-h-[420px]"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Left Slider Navigation Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-2 z-20 flex size-9 md:size-11 items-center justify-center rounded-sm bg-black/60 backdrop-blur-xs text-mist/70 hover:text-jade hover:bg-black/85 border border-white/10 hover:border-jade/30 transition-all opacity-0 group-hover/banner:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade"
        aria-label="Previous slide"
      >
        <CaretLeft size={20} weight="bold" />
      </button>

      {/* Carousel Core Slider Area */}
      <div className="w-full relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5 h-[320px] md:h-[380px] lg:h-[420px]"
          >
            {/* Column 1: Stacked (Item 0, Item 1) - Desktop only */}
            <div className="hidden lg:flex flex-col gap-3 md:gap-4 h-full">
              <BannerMiniCard media={currentSlideItems[0]} priority={activeSlide === 0} />
              <BannerMiniCard media={currentSlideItems[1]} priority={activeSlide === 0} />
            </div>

            {/* Column 2: Large (Item 2) - All screens */}
            <div className="h-full">
              <BannerLargeCard media={currentSlideItems[2]} priority={activeSlide === 0} />
            </div>

            {/* Column 3: Stacked (Item 3, Item 4) - All screens */}
            <div className="flex flex-col gap-3 md:gap-4 h-full">
              <BannerMiniCard media={currentSlideItems[3]} priority={activeSlide === 0} />
              <BannerMiniCard media={currentSlideItems[4]} priority={activeSlide === 0} />
            </div>

            {/* Column 4: Large Card (Item 5) - Tablet and Desktop */}
            <div className="hidden md:block h-full">
              <BannerLargeCard media={currentSlideItems[5]} priority={activeSlide === 0} />
            </div>

            {/* Column 5: Stacked (Item 6, Item 7) - Desktop only */}
            <div className="hidden lg:flex flex-col gap-3 md:gap-4 h-full">
              <BannerMiniCard media={currentSlideItems[6]} priority={activeSlide === 0} />
              <BannerMiniCard media={currentSlideItems[7]} priority={activeSlide === 0} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Pagination Dots Overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setActiveSlide(idx)
              }}
              className={`size-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx ? "bg-jade w-3" : "bg-white/20 hover:bg-white/45"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right Slider Navigation Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-2 z-20 flex size-9 md:size-11 items-center justify-center rounded-sm bg-black/60 backdrop-blur-xs text-mist/70 hover:text-jade hover:bg-black/85 border border-white/10 hover:border-jade/30 transition-all opacity-0 group-hover/banner:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade"
        aria-label="Next slide"
      >
        <CaretRight size={20} weight="bold" />
      </button>
    </div>
  )
}

export default FeaturedBanner
