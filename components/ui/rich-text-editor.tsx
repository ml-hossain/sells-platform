"use client"

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  Table as TableIcon,
  Plus,
  Trash2,
  Code2,
  Upload,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  error?: boolean
  fullPageView?: boolean
  onToggleFullPage?: () => void
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Enter detailed information...",
  className,
  error = false,
  fullPageView = false,
  onToggleFullPage
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 font-semibold text-left p-2 border',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border p-2',
        },
      }),

    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
      editorProps: {
        attributes: {
          class: cn(
            'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] overflow-y-auto p-4',
            !fullPageView && 'max-h-[400px]',
            fullPageView && 'max-w-none w-full h-full',
            error && 'border-red-500'
          ),
        },
      handlePaste: (view, event, slice) => {
        const clipboardData = event.clipboardData
        if (clipboardData && editor) {
          const html = clipboardData.getData('text/html')
          if (html) {
            // Parse and insert HTML content
            try {
              editor.commands.setContent(html)
              return true // Prevent default paste behavior
            } catch (error) {
              console.warn('Failed to parse HTML:', error)
            }
          }
        }
        return false // Use default paste behavior
      },
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt('Enter the URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt('Enter the image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const insertTable = () => {
    const rows = window.prompt('Number of rows:', '3')
    const cols = window.prompt('Number of columns:', '3')

    if (rows && cols) {
      editor.chain().focus().insertTable({ rows: parseInt(rows), cols: parseInt(cols), withHeaderRow: true }).run()
    }
  }

  const addColumnBefore = () => editor.chain().focus().addColumnBefore().run()
  const addColumnAfter = () => editor.chain().focus().addColumnAfter().run()
  const deleteColumn = () => editor.chain().focus().deleteColumn().run()
  const addRowBefore = () => editor.chain().focus().addRowBefore().run()
  const addRowAfter = () => editor.chain().focus().addRowAfter().run()
  const deleteRow = () => editor.chain().focus().deleteRow().run()
  const deleteTable = () => editor.chain().focus().deleteTable().run()

  const mergeCells = () => editor.chain().focus().mergeCells().run()
  const splitCell = () => editor.chain().focus().splitCell().run()
  const toggleHeaderCell = () => editor.chain().focus().toggleHeaderCell().run()

  const insertHTML = () => {
    // Create a modal dialog for unlimited HTML input
    const modal = document.createElement('div')
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `

    const dialog = document.createElement('div')
    dialog.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 80%;
      max-width: 800px;
      max-height: 80%;
      display: flex;
      flex-direction: column;
    `

    const title = document.createElement('h3')
    title.textContent = 'Insert HTML Content'
    title.style.cssText = 'margin: 0 0 15px 0; font-size: 18px; font-weight: 600;'

    const textarea = document.createElement('textarea')
    textarea.placeholder = 'Enter your HTML content here...'
    textarea.style.cssText = `
      width: 100%;
      min-height: 300px;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      font-family: monospace;
      font-size: 14px;
      resize: vertical;
      margin-bottom: 15px;
    `

    const buttonContainer = document.createElement('div')
    buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;'

    const insertButton = document.createElement('button')
    insertButton.textContent = 'Insert HTML'
    insertButton.style.cssText = `
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    `

    const cancelButton = document.createElement('button')
    cancelButton.textContent = 'Cancel'
    cancelButton.style.cssText = `
      background: #6c757d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    `

    buttonContainer.appendChild(cancelButton)
    buttonContainer.appendChild(insertButton)
    
    dialog.appendChild(title)
    dialog.appendChild(textarea)
    dialog.appendChild(buttonContainer)
    modal.appendChild(dialog)
    document.body.appendChild(modal)

    // Focus on textarea
    textarea.focus()

    // Event handlers
    insertButton.onclick = () => {
      const html = textarea.value.trim()
      if (html && editor) {
        try {
          editor.chain().focus().insertContent(html).run()
          document.body.removeChild(modal)
        } catch (error) {
          console.warn('Failed to parse HTML:', error)
          alert('Invalid HTML content. Please check your HTML syntax.')
        }
      } else {
        document.body.removeChild(modal)
      }
    }

    cancelButton.onclick = () => {
      document.body.removeChild(modal)
    }

    // Close on ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modal)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    // Close on backdrop click
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }

  const uploadHTMLFile = () => {
    // Create a file input
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.html,.htm'
    fileInput.style.display = 'none'

    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const htmlContent = e.target?.result as string
          if (htmlContent && editor) {
            try {
              // Insert the HTML content into the editor
              editor.chain().focus().insertContent(htmlContent).run()
            } catch (error) {
              console.warn('Failed to parse HTML file:', error)
              alert('Invalid HTML file content. Please check your HTML syntax.')
            }
          }
        }
        reader.readAsText(file)
      }
    }

    // Trigger file selection
    document.body.appendChild(fileInput)
    fileInput.click()
    document.body.removeChild(fileInput)
  }


  return (
    <div className={cn(
      "border rounded-lg overflow-hidden w-full", 
      error && "border-red-500", 
      className, 
      fullPageView && "fixed inset-0 z-50 bg-white flex flex-col"
    )}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50/50 p-1 sm:p-2 overflow-x-auto">
        {/* Row 1: Main formatting tools */}
        <div className="flex flex-wrap gap-1 min-w-max mb-1">
          {/* Text Formatting */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('bold') && "bg-gray-200"
              )}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('italic') && "bg-gray-200"
              )}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('underline') && "bg-gray-200"
              )}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('strike') && "bg-gray-200"
              )}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('code') && "bg-gray-200"
              )}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Headings */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn(
                "h-8 px-2 text-xs font-semibold",
                editor.isActive('heading', { level: 1 }) && "bg-gray-200"
              )}
            >
              H1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn(
                "h-8 px-2 text-xs font-semibold",
                editor.isActive('heading', { level: 2 }) && "bg-gray-200"
              )}
            >
              H2
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={cn(
                "h-8 px-2 text-xs font-semibold",
                editor.isActive('heading', { level: 3 }) && "bg-gray-200"
              )}
            >
              H3
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('paragraph') && "bg-gray-200"
              )}
            >
              <Type className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Lists */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('bulletList') && "bg-gray-200"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('orderedList') && "bg-gray-200"
              )}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('blockquote') && "bg-gray-200"
              )}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Alignment */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: 'left' }) && "bg-gray-200"
              )}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: 'center' }) && "bg-gray-200"
              )}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: 'right' }) && "bg-gray-200"
              )}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: 'justify' }) && "bg-gray-200"
              )}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Media & Links */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={addLink}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive('link') && "bg-gray-200"
              )}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={addImage}
              className="h-8 w-8 p-0"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 w-8 p-0"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 w-8 p-0"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          {/* Full Page Toggle */}
          {onToggleFullPage && (
            <div className="flex gap-1 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={onToggleFullPage}
                className="h-8 w-8 p-0"
                title={fullPageView ? "Exit Full Page" : "Full Page View"}
              >
                {fullPageView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        {/* Row 2: Table controls and additional tools */}
        <div className="flex flex-wrap gap-1 min-w-max">
          {/* Table Controls */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={insertTable}
              className="h-8 w-8 p-0"
              title="Insert Table"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            {editor.isActive('table') && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={addColumnBefore}
                  className="h-8 w-8 p-0"
                  title="Add Column Before"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={addColumnAfter}
                  className="h-8 w-8 p-0"
                  title="Add Column After"
                >
                  <Plus className="h-4 w-4 rotate-45" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={deleteColumn}
                  className="h-8 w-8 p-0"
                  title="Delete Column"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={addRowBefore}
                  className="h-8 w-8 p-0"
                  title="Add Row Before"
                >
                  <Plus className="h-4 w-4 rotate-90" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={addRowAfter}
                  className="h-8 w-8 p-0"
                  title="Add Row After"
                >
                  <Plus className="h-4 w-4 -rotate-90" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={deleteRow}
                  className="h-8 w-8 p-0"
                  title="Delete Row"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={deleteTable}
                  className="h-8 w-8 p-0"
                  title="Delete Table"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={mergeCells}
                  className="h-8 w-8 p-0"
                  title="Merge Cells"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={splitCell}
                  className="h-8 w-8 p-0"
                  title="Split Cell"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={toggleHeaderCell}
                  className="h-8 w-8 p-0"
                  title="Toggle Header Cell"
                >
                  <Type className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* HTML Insert */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={insertHTML}
              className="h-8 w-8 p-0"
              title="Insert HTML"
            >
              <Code2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={uploadHTMLFile}
              className="h-8 w-8 p-0"
              title="Upload HTML File"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className={cn(
          "bg-white",
          fullPageView ? "h-[calc(100vh-120px)] flex-1" : "min-h-[200px]",
          error && "border-red-500"
        )}
      />
    </div>
  )
}

export default RichTextEditor
