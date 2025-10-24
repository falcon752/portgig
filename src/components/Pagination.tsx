"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const displayPages = isMobile ? 4 : Math.min(totalPages, 8)
  const pages = Array.from({ length: displayPages }, (_, i) => i + 1)

  return (
    <div className="bodyMargin flex items-center justify-center space-x-1 sm:space-x-2 mt-6 mb-10 mx-auto">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A1754]" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 min-w-10 min-h-10 rounded-full font-medium transition-colors flex items-center justify-center shrink-0 ${
            currentPage === page 
              ? "bg-[#0A1754] text-white" 
              : "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A1754]" />
      </button>
    </div>
  )
}