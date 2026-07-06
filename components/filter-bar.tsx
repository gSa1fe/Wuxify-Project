"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup as BaseToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useLanguage } from "@/hooks/useLanguage"
import { useDebounce } from "@/hooks/useDebounce"
import { MagnifyingGlass, X } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"

const ToggleGroup = BaseToggleGroup as unknown as React.ComponentType<{
  type?: "single" | "multiple"
  value?: string | string[]
  onValueChange?: (value: string) => void
  className?: string
  children?: React.ReactNode
}>

interface SortSelectProps {
  value: string
  onValueChange: (value: string | null) => void
  className?: string
}

function SortSelect({ value, onValueChange, className }: SortSelectProps) {
  const { t } = useLanguage()

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Sort order">
          {value === "UPDATED_AT_DESC"
            ? t("sortUpdated")
            : value === "START_DATE_DESC"
            ? t("sortStartDate")
            : value === "POPULARITY_DESC"
            ? t("sortPopularity")
            : value === "TRENDING_DESC"
            ? t("sortTrending")
            : t("sortTrending")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-ink border-border text-foreground">
        <SelectItem value="UPDATED_AT_DESC">{t("sortUpdated")}</SelectItem>
        <SelectItem value="START_DATE_DESC">{t("sortStartDate")}</SelectItem>
        <SelectItem value="POPULARITY_DESC">{t("sortPopularity")}</SelectItem>
        <SelectItem value="TRENDING_DESC">{t("sortTrending")}</SelectItem>
      </SelectContent>
    </Select>
  )
}

interface FilterBarProps {
  startTransition: React.TransitionStartFunction
  updateFilters: (updates: Record<string, string | number | null>) => void
}

export function FilterBar({ startTransition, updateFilters }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  // Local Search Input State
  const [searchValue, setSearchValue] = useState("")
  const debouncedSearch = useDebounce(searchValue, 300)

  // Current URL state values
  const currentType = searchParams.get("type") || "ALL"
  const currentStatus = searchParams.get("status") || "ALL"
  const currentSort = searchParams.get("sort") || "TRENDING_DESC"

  const isSearchOpen = searchParams.get("searchOpen") === "true"

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 120)
      return () => clearTimeout(timer)
    }
  }, [isSearchOpen])

  // Sync debounced local search value back to URL search param
  useEffect(() => {
    const currentSearch = searchParams.get("search") || ""
    if (debouncedSearch !== currentSearch) {
      updateFilters({ search: debouncedSearch || null })
    }
  }, [debouncedSearch, searchParams, updateFilters])

  // Sync local search when URL search param changes externally (e.g. browser back/forward)
  useEffect(() => {
    const externalSearch = searchParams.get("search") || ""
    if (externalSearch !== searchValue) {
      Promise.resolve().then(() => setSearchValue(externalSearch))
    }
  }, [searchParams, searchValue])

  const handleCloseSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("searchOpen")
    params.delete("search")
    params.delete("type")
    params.delete("status")
    params.delete("sort")
    params.delete("page")
    setSearchValue("")
    startTransition(() => {
      router.push("/")
    })
  }

  return (
    <AnimatePresence initial={false}>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="sticky top-14 md:top-16 z-40 overflow-hidden bg-background/85 backdrop-blur-md border-b border-border/40 py-3.5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search input and Sort selector */}
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                />
                <Input
                  ref={searchInputRef}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="pl-9 h-9 bg-background border-border/40 text-foreground placeholder:text-muted-foreground/40 rounded-sm focus-visible:ring-1 focus-visible:ring-jade focus-visible:border-jade text-sm transition-all"
                />
              </div>

              {/* Sort selection (Desktop) */}
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{t("sortBy")}</span>
                <SortSelect
                  value={currentSort}
                  onValueChange={(val) => updateFilters({ sort: val })}
                  className="w-44 h-9 bg-background border-border/40 text-foreground rounded-sm focus:ring-1 focus:ring-jade text-xs"
                />
              </div>
            </div>

            {/* Toggles (Format & Status) */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {/* Format Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {t("filterFormat")}
                </span>
                <ToggleGroup
                  type="single"
                  value={currentType}
                  onValueChange={(val) => val && updateFilters({ type: val })}
                  className="justify-start gap-0.5 bg-foreground/5 p-0.5 rounded-sm border border-border/20"
                >
                  <ToggleGroupItem
                    value="ALL"
                    className={`rounded-sm text-xs px-2.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade ${
                      currentType === "ALL"
                        ? "bg-foreground/10 text-foreground font-semibold"
                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {t("formatAll")}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="ANIME"
                    className={`rounded-sm text-xs px-2.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade ${
                      currentType === "ANIME"
                        ? "bg-foreground/10 text-foreground font-semibold"
                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {t("formatAnime")}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="MANGA"
                    className={`rounded-sm text-xs px-2.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade ${
                      currentType === "MANGA"
                        ? "bg-foreground/10 text-foreground font-semibold"
                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {t("formatManga")}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {t("filterStatus")}
                </span>
                <ToggleGroup
                  type="single"
                  value={currentStatus}
                  onValueChange={(val) => val && updateFilters({ status: val })}
                  className="justify-start gap-0.5 bg-foreground/5 p-0.5 rounded-sm border border-border/20"
                >
                  <ToggleGroupItem
                    value="ALL"
                    className={`rounded-sm text-xs px-2.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade ${
                      currentStatus === "ALL"
                        ? "bg-foreground/10 text-foreground font-semibold"
                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {t("statusAll")}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="RELEASING"
                    className={`rounded-sm text-xs px-2.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade ${
                      currentStatus === "RELEASING"
                        ? "bg-foreground/10 text-foreground font-semibold"
                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {t("statusReleasing")}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="NOT_YET_RELEASED"
                    className={`rounded-sm text-xs px-2.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade ${
                      currentStatus === "NOT_YET_RELEASED"
                        ? "bg-foreground/10 text-foreground font-semibold"
                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {t("statusUpcoming")}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Sort selection for mobile (visible under md) */}
              <div className="flex items-center gap-2 md:hidden shrink-0 w-full xs:w-auto mt-1 sm:mt-0">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{t("sortBy")}</span>
                <SortSelect
                  value={currentSort}
                  onValueChange={(val) => updateFilters({ sort: val })}
                  className="flex-1 xs:w-40 h-9 bg-background border-border/40 text-foreground rounded-sm focus:ring-1 focus:ring-jade text-xs"
                />
              </div>

              {/* Clear & Close Button — Desktop (inline) */}
              <button
                onClick={handleCloseSearch}
                className="hidden md:flex p-1.5 rounded-sm hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-transparent hover:border-border/30"
                aria-label="Clear and close filters"
              >
                <X size={16} />
              </button>
            </div>

            {/* Clear & Close Button — Mobile (centered) */}
            <div className="flex md:hidden justify-center pt-2 border-t border-border/20">
              <button
                onClick={handleCloseSearch}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-xs font-mono uppercase tracking-wider"
                aria-label="Clear and close filters"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
