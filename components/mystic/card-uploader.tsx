"use client"

import type React from "react"
import { useRef } from "react"
import { useLanguage } from "@/contexts/language-context"

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

interface CardUploaderProps {
  frontImage: string | null
  backImage: string | null
  onFrontChange: (url: string | null) => void
  onBackChange: (url: string | null) => void
  onClose: () => void
}

export function CardUploader({ frontImage, backImage, onFrontChange, onBackChange, onClose }: CardUploaderProps) {
  const { t } = useLanguage()
  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      if (type === "front") {
        onFrontChange(url)
      } else {
        onBackChange(url)
      }
    }
  }

  const handleClear = (type: "front" | "back") => {
    if (type === "front") {
      onFrontChange(null)
      if (frontInputRef.current) frontInputRef.current.value = ""
    } else {
      onBackChange(null)
      if (backInputRef.current) backInputRef.current.value = ""
    }
  }

  return (
    <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10 w-[280px] md:w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/90 text-sm font-medium flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          {t("menu.customCards")}
        </h3>
        <button onClick={onClose} className="text-white/50 hover:text-white/90 transition-colors">
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Front image upload */}
        <div className="space-y-2">
          <label className="text-white/70 text-xs">{t("menu.frontImage")}</label>
          <div className="flex gap-2">
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "front")}
              className="hidden"
              id="front-upload"
            />
            <label
              htmlFor="front-upload"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors text-white/80 text-xs"
            >
              <UploadIcon className="w-3 h-3" />
              {frontImage ? t("menu.changeImage") : t("menu.uploadImage")}
            </label>
            {frontImage && (
              <button
                onClick={() => handleClear("front")}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-xs transition-colors"
              >
                {t("menu.clear")}
              </button>
            )}
          </div>
          {frontImage && (
            <div className="relative w-12 h-20 rounded overflow-hidden border border-white/20">
              <img src={frontImage || "/placeholder.svg"} alt="Front preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Back image upload */}
        <div className="space-y-2">
          <label className="text-white/70 text-xs">{t("menu.backImage")}</label>
          <div className="flex gap-2">
            <input
              ref={backInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "back")}
              className="hidden"
              id="back-upload"
            />
            <label
              htmlFor="back-upload"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors text-white/80 text-xs"
            >
              <UploadIcon className="w-3 h-3" />
              {backImage ? t("menu.changeImage") : t("menu.uploadImage")}
            </label>
            {backImage && (
              <button
                onClick={() => handleClear("back")}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-xs transition-colors"
              >
                {t("menu.clear")}
              </button>
            )}
          </div>
          {backImage && (
            <div className="relative w-12 h-20 rounded overflow-hidden border border-white/20">
              <img src={backImage || "/placeholder.svg"} alt="Back preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
