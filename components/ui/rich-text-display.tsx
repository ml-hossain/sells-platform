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
      // Wrap tables in scrollable containers with better event handling
      const tables = containerRef.current.querySelectorAll('table')
      tables.forEach(table => {
        // Skip if already wrapped
        if (table.parentElement?.classList.contains('table-scroll-wrapper')) {
          return
        }
        
        // Create wrapper with enhanced scroll protection
        const wrapper = document.createElement('div')
        wrapper.className = 'table-scroll-wrapper'
        wrapper.style.cssText = `
          overflow-x: auto;
          overflow-y: visible;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          margin: 1rem 0;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          position: relative;
          z-index: 1;
        `
        
        // Prevent ALL click events from bubbling up from table area
        const stopEvent = (e: Event) => {
          e.stopPropagation()
          e.stopImmediatePropagation()
        }
        
        wrapper.addEventListener('click', stopEvent, true)
        wrapper.addEventListener('mousedown', stopEvent, true)
        wrapper.addEventListener('mouseup', stopEvent, true)
        wrapper.addEventListener('touchstart', stopEvent, true)
        wrapper.addEventListener('touchend', stopEvent, true)
        wrapper.addEventListener('touchmove', stopEvent, true)
        
        // Insert wrapper and move table into it
        table.parentNode?.insertBefore(wrapper, table)
        wrapper.appendChild(table)
        
        // Ensure table takes full width
        table.style.margin = '0'
        table.style.width = '100%'
      })
    }
  }, [content])

  return (
    <div
      ref={containerRef}
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:text-gray-900 prose-headings:mb-2 prose-headings:mt-4",
        "prose-p:text-gray-700 prose-p:mb-3 prose-strong:text-gray-900",
        "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
        "prose-blockquote:border-l-violet-500 prose-blockquote:text-gray-600",
        "prose-h1:mb-2 prose-h1:mt-4 prose-h2:mb-2 prose-h2:mt-4",
        "prose-h3:mb-2 prose-h3:mt-3 prose-h4:mb-2 prose-h4:mt-3",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default RichTextDisplay
