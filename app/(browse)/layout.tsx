import React from "react"

interface BrowseLayoutProps {
  children: React.ReactNode
}

export default function BrowseLayout({ children }: BrowseLayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 flex flex-col gap-6">
      {children}
    </div>
  )
}
