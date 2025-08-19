"use client"

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface RichTextDisplayProps {
  content: string
  className?: string
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({
  content,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Wrap tables for horizontal scrolling
      const tables = containerRef.current.querySelectorAll('table')
      tables.forEach(table => {
        // Skip if already wrapped
        if (table.parentElement?.classList.contains('table-scroll-wrapper')) {
          return
        }
        
        // Create wrapper for horizontal scrolling
        const wrapper = document.createElement('div')
        wrapper.className = 'table-scroll-wrapper'
        
        // Insert wrapper and move table into it
        table.parentNode?.insertBefore(wrapper, table)
        wrapper.appendChild(table)
      })
    }
  }, [content])

  return (
    <div
      ref={containerRef}
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:text-gray-900 prose-headings:mb-3 prose-headings:mt-4",
        "prose-p:text-gray-700 prose-p:mb-4 prose-p:leading-relaxed",
        "prose-strong:text-gray-900 prose-strong:font-semibold",
        "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
        "prose-ul:my-4 prose-ol:my-4 prose-li:my-1",
        "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default RichTextDisplay
