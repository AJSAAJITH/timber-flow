// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-6">
      <main className="flex flex-col items-center justify-center w-full max-w-md py-16 px-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 text-center gap-6">

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            TimberFlow
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            Multi-Branch POS & Inventory Management System
          </p>
        </div>

        {/* 💡 සරල Sign In Button එකක්. මේකෙන් කෙලින්ම අපේ /sign-in පේජ් එකට යනවා */}
        <Link
          href="/sign-in"
          className="w-full flex h-12 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 font-medium transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
        >
          Sign In to System
        </Link>

      </main>
    </div>
  );
}