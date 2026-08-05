// app/unauthorized/page.tsx
import { SignOutButton } from "@clerk/nextjs";
import { ShieldAlert, LogOut } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
            <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                    <ShieldAlert className="h-8 w-8" />
                </div>

                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    ගිණුම හමු නොවීය (Access Denied)
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    ඔබගේ ගිණුම පද්ධතිය තුළ සක්‍රිය කර නොමැත. Super Admin විසින් ඔබව පද්ධතියට එකතු කළ පසු පමණක් ලොග් විය හැක.
                </p>

                <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                    <SignOutButton redirectUrl="/sign-in">
                        <button className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </div>
    );
}