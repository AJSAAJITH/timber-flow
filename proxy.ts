import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 💡 රූට් පිටුව (/) සහ Sign-in පිටුව ලොග් නොවී යා හැකි පොදු පිටු ලෙස සකසයි
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)']);

export default clerkMiddleware(async (auth, request) => {

    const { userId } = await auth();
    const currentUrl = new URL(request.url);

    // 🔥 යූසර් ලොග් වෙලා ඉන්නවා නම් සහ රූට් (/) පේජ් එකට ආවොත්, 
    // කිසිම ප්‍රමාදයකින් තොරව කෙලින්ම /dashboard එකට රීඩිරෙක්ට් කරයි.
    if (userId && currentUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // පොදු පිටුවක් නොවේ නම් අනිවාර්යයෙන්ම Authentication පරීක්ෂා කරයි
    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Next.js internals සහ static ෆයිල්ස් හැර අනෙක් සියලුම දේ පරීක්ෂා කිරීමට
        '/((?!_next|[^?]*\\.[^?]*$$).*)',
        '/(api|trpc)(.*)',
    ],
};