"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Lock, TrendingUp } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 md:py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              T
            </div>
            <span className="hidden sm:inline text-xl font-bold text-foreground">
              TimberFlow
            </span>
          </div>
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
            TimberFlow
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Premium Multi-Branch POS & Inventory Management System
          </p>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Built for retail excellence with responsive mobile-first design
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                Launch Dashboard →
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: BarChart3,
              title: "Analytics Dashboard",
              description:
                "Real-time sales metrics and comprehensive business insights",
            },
            {
              icon: Lock,
              title: "Role-Based Access",
              description:
                "SUPER_ADMIN, ADMIN, and CASHIER roles with granular permissions",
            },
            {
              icon: TrendingUp,
              title: "Multi-Branch Support",
              description:
                "Manage multiple locations with centralized inventory control",
            },
          ].map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur hover:bg-card/80 transition-colors"
              >
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Mobile-First Notice */}
        <div className="mt-16 rounded-lg border border-border bg-card/50 p-6 sm:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">
              📱 Mobile-First Design
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              Perfect for Cashiers & Managers
            </h2>
            <p className="mt-4 text-muted-foreground">
              Optimized for phone and tablet use with an intuitive hamburger menu
              on mobile and a collapsible sidebar on desktop. Every feature is
              designed for fast, touch-friendly interaction.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
        <p>
          TimberFlow © 2024. Premium POS & Inventory Management System built with
          Next.js 15, Tailwind CSS, and Shadcn UI.
        </p>
      </footer>
    </main>
  )
}
