import { useState, useRef, useCallback } from "react"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { Button } from "./button"
import { uploadFile } from "@/services/upload.service"
import { toast } from "sonner"

interface FileUploadProps {
  /** Current file URL (for preview) */
  value?: string | null
  /** Called with the uploaded file URL */
  onChange: (url: string | null) => void
  /** Upload folder on server */
  folder?: string
  /** Accepted file types */
  accept?: string
  /** Placeholder text */
  placeholder?: string
  /** Whether to show image preview */
  preview?: boolean
  /** Additional CSS classes for the container */
  className?: string
  /** Disabled state */
  disabled?: boolean
}

export function FileUpload({
  value,
  onChange,
  folder = "uploads",
  accept = "image/jpeg,image/png,image/webp",
  placeholder = "Chọn ảnh hoặc kéo thả vào đây",
  preview = true,
  className = "",
  disabled = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(
    async (file: File) => {
      // Validate size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File quá lớn. Tối đa 5MB.")
        return
      }

      setIsUploading(true)
      try {
        const result = await uploadFile(file, folder)
        onChange(result.url)
      } catch {
        toast.error("Upload thất bại. Vui lòng thử lại.")
      } finally {
        setIsUploading(false)
      }
    },
    [folder, onChange],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    // Reset input so the same file can be selected again
    e.target.value = ""
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled || isUploading) return
      const file = e.dataTransfer.files?.[0]
      if (file) handleUpload(file)
    },
    [disabled, isUploading, handleUpload],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading) setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleRemove = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  // Has a file/URL
  if (value && preview) {
    return (
      <div className={`relative group ${className}`}>
        <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = "none"
            }}
          />
          {!disabled && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-8 gap-1.5"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
                Đổi
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-8 gap-1.5"
                onClick={handleRemove}
              >
                <X className="h-3.5 w-3.5" />
                Xóa
              </Button>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    )
  }

  // Upload zone (no file yet or no preview)
  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        className={`
          flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4
          transition-colors cursor-pointer min-h-[100px]
          ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isUploading ? "pointer-events-none" : ""}
        `}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Đang tải lên...</p>
          </>
        ) : (
          <>
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center">
              {placeholder}
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              JPG, PNG, WebP — Tối đa 5MB
            </p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      {/* Show URL if value exists but preview is off */}
      {value && !preview && (
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-xs text-muted-foreground truncate flex-1">{value}</span>
          {!disabled && (
            <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleRemove}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
