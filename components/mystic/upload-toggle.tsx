"use client"

import { useLanguage } from "@/contexts/language-context"

interface UploadToggleProps {
  onClick: () => void
}

export function UploadToggle({ onClick }: UploadToggleProps) {
  const { t } = useLanguage()
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white transition-all"
      title={t("menu.customCards")}
    >
      {/* Settings icon */}
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    </button>
  )
}
