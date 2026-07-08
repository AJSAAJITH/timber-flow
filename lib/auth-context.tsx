"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { getAuthenticatedUser } from "@/actions/auth" // 💡 කලින් පියවරේ හදපු action එක මෙතනට import කරන්න

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "CASHIER"

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    branch?: {
        id: string
        name: string
    }
}

export interface AuthContextType {
    user: User | null
    isLoading: boolean
    refreshUser: () => Promise<void> // 💡 ඕනෑම වෙලාවක යූසර්ව අප්ඩේට් කරගන්න පුළුවන් ෆන්ක්ෂන් එකක්
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
    children,
    user: initialUser,
}: {
    children: React.ReactNode
    user?: User | null
}) {
    const [authUser, setAuthUser] = useState<User | null>(initialUser || null)
    const [isLoading, setIsLoading] = useState(!initialUser) // initialUser එකක් Layout එකෙන් ආවොත් loading false කරයි

    // යූසර්ගේ ඩේටා ඩේටාබේස් එකෙන් Fetch කරන ප්‍රධාන ෆන්ක්ෂන් එක
    const fetchUser = async () => {
        try {
            setIsLoading(true)
            const data = await getAuthenticatedUser()
            setAuthUser(data)
        } catch (err) {
            console.error("Failed to fetch auth user:", err)
            setAuthUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // සර්වර් ලේඅවුට් එකෙන් කෙලින්ම යූසර් ආවොත් ඒක සෙට් කරනවා, නැත්නම් ඇක්ෂන් එක රන් කරනවා
        if (initialUser) {
            setAuthUser(initialUser)
            setIsLoading(false)
        } else {
            fetchUser()
        }
    }, [initialUser])

    return (
        <AuthContext.Provider value={{ user: authUser, isLoading, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}