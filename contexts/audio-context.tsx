"use client"

import React, { createContext, useContext, useRef, useCallback } from "react"

interface AudioContextType {
  startAudio: () => void
  stopAudio: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startAudio = useCallback(() => {
    // 背景音乐已禁用
    // if (!audioRef.current) {
    //   audioRef.current = new Audio("/audio/Secret garden the promise.mp3")
    //   audioRef.current.loop = true
    //   audioRef.current.volume = 0.5 // 设置适中的音量
    // }
    // 
    // // 浏览器通常要求用户交互后才能播放音频
    // audioRef.current.play().catch((error) => {
    //   console.error("Audio playback failed:", error)
    // })
  }, [])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  return (
    <AudioContext.Provider value={{ startAudio, stopAudio }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

