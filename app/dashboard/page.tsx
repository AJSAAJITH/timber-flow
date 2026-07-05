// src/app/dashboard/page.tsx
import { syncWithDB } from '@/actions/auth';
import { redirect } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs' // 👈 Clerk එකෙන් SignOutButton එක Import කරගන්නවා

export default async function DashboardPage() {
    // අපේ සර්වර් ඇක්ෂන් එක මෙතනදී Call කරනවා
    const result = await syncWithDB();

    // මොකක් හරි අවුලක් නම් හෝ ලොග් වෙලා නැත්නම් Sign-in එකට හරවනවා
    if (!result.success || !result.user) {
        redirect('/sign-in')
    }

    const dbUser = result.user

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-6">
            <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    TimberFlow Dashboard
                </h1>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                    ආයුබෝවන් **{dbUser.name}**!
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                    ඔයාගේ සිස්ටම් Role එක: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{dbUser.role}</span>
                </p>

                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg text-sm text-emerald-800 dark:text-emerald-300">
                    ✅ Clerk Auth සහ Neon DB එක Server Action එකක් හරහා සාර්ථකව සින්ක් වුණා!
                </div>

                {/* ⬇️ මෙතන ඉඳන් Logout Button එක එකතු වෙනවා */}
                <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                    <SignOutButton>
                        <button className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                            Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </div>
    )
}