"use client"

import { useTransition, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MediaPage, Media } from "@/types"
import { MediaCard } from "@/components/media-card"
import { useLanguage } from "@/hooks/useLanguage"
import { ArrowLeft, ArrowRight, Funnel } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { FilterBar } from "@/components/filter-bar"
import { FeaturedBanner } from "@/components/featured-banner"
import { GenreTagBar } from "@/components/genre-tag-bar"

interface MediaGridProps {
  initialData: MediaPage
  featuredMedia?: Media[]
}

export function MediaGrid({ initialData, featuredMedia }: MediaGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { t } = useLanguage()

  // Current URL state values
  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const search = searchParams.get("search") || ""

  // Helper to update search params and trigger Server Component refresh
  const updateFilters = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "ALL") {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    // Default: reset to page 1 if other filters change and page is not explicitly modified
    if (!updates.hasOwnProperty("page")) {
      params.delete("page")
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`)
    })
  }, [router, searchParams, startTransition])



  return (
    <section className="flex flex-col gap-8 w-full" aria-label="Browse Titles">
      {/* Featured Banner (Bilibili Style) */}
      {featuredMedia && featuredMedia.length >= 8 && (
        <div className="w-full">
          <FeaturedBanner mediaList={featuredMedia} />
        </div>
      )}

      {/* Page Hero */}
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl md:text-4xl font-black uppercase tracking-wider text-foreground">
          {t("heroTitle")} <span className="text-jade">{t("heroTitleHighlight")}</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl font-sans">
          {t("heroDesc")}
        </p>
      </div>

      {/* Genre Tag Bar */}
      {currentPage === 1 && !search && (
        <GenreTagBar />
      )}

      {/* Collapsible Sticky Filter Bar */}
      <FilterBar startTransition={startTransition} updateFilters={updateFilters} />

      {/* Grid of items */}
      {initialData.media.length === 0 ? (
        isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-3 w-full">
                <Skeleton className="aspect-[3/4] w-full bg-foreground/5 rounded-sm" />
                <Skeleton className="h-4 w-3/4 bg-foreground/5 rounded-sm" />
                <Skeleton className="h-3 w-1/2 bg-foreground/5 rounded-sm mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-card border border-border/40 rounded-sm text-center">
            <Funnel size={48} className="text-muted-foreground/30 mb-4" />
            <h3 className="font-heading text-lg font-bold text-foreground mb-1">{t("noTitles")}</h3>
            <p className="text-sm text-muted-foreground">{t("adjustFilters")}</p>
          </div>
        )
      ) : (
        <motion.div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 transition-all duration-300 ${
            isPending ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          <AnimatePresence mode="popLayout">
            {initialData.media.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <MediaCard media={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {!isPending && initialData.media.length > 0 && (
        <div className="flex items-center justify-between mt-4 p-4 border-t border-border/40">
          <span className="text-xs font-mono text-muted-foreground">
            {t("pageOf", {
              current: initialData.pageInfo.currentPage,
              total: initialData.pageInfo.lastPage,
            })}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => updateFilters({ page: currentPage - 1 })}
              className="rounded-sm text-xs border-border/60 hover:bg-foreground/5 hover:text-jade flex items-center gap-1"
            >
              <ArrowLeft size={14} /> {t("prev")}
            </Button>
            <Button
              variant="outline"
              disabled={!initialData.pageInfo.hasNextPage}
              onClick={() => updateFilters({ page: currentPage + 1 })}
              className="rounded-sm text-xs border-border/60 hover:bg-foreground/5 hover:text-jade flex items-center gap-1"
            >
              {t("next")} <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
export default MediaGrid
