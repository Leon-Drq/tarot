"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { authApi, User, setAccessToken, getAccessToken } from "@/lib/api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, nickname?: string, referralCode?: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 加载用户信息
  const loadUser = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("[Auth] Failed to load user:", error)
      // Token 无效，清除
      setAccessToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 初始化加载
  useEffect(() => {
    loadUser()
  }, [loadUser])

  // 登录
  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    setAccessToken(response.access_token)
    setUser(response.user)
  }, [])

  // 注册
  const register = useCallback(async (
    email: string,
    password: string,
    nickname?: string,
    referralCode?: string
  ) => {
    const response = await authApi.register(email, password, nickname, referralCode)
    setAccessToken(response.access_token)
    // 注册后获取完整用户信息
    const userData = await authApi.getCurrentUser()
    setUser(userData)
  }, [])

  // 登出
  const logout = useCallback(() => {
    setAccessToken(null)
    setUser(null)
  }, [])

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    await loadUser()
  }, [loadUser])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isLoggedIn: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

