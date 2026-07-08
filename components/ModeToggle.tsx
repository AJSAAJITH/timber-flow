"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Next.js වල Server-Side component සහ Client-Side එක ගැලපෙන්න (Hydration සදහා)
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleToggle = () => {
        // දැනට තියෙන්නේ 'system' තීම් එක නම් ඇත්තටම ඇප්ලයි වෙලා තියෙන තීම් එක (resolvedTheme) ගන්නවා
        const currentTheme = theme === "system" ? resolvedTheme : theme
        // Dark නම් Light කරනවා, නැත්නම් Dark කරනවා
        setTheme(currentTheme === "dark" ? "light" : "dark")
    }

    // Component එක මුලින්ම ලෝඩ් වෙනකන් පේන Placeholder බටන් එක
    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-md">
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        )
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            className="h-10 w-10 shrink-0 rounded-md border border-border hover:bg-accent transition-colors"
            aria-label="Toggle theme"
        >
            {/* Sun Icon එක Dark මෝඩ් එකේදී කැරකිලා හැංගෙනවා */}
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            {/* Moon Icon එක Dark මෝඩ් එකේදී කැරකිලා මතුවෙනවා */}
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}