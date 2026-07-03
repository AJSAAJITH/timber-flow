import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ලොග් නොවී යා හැකි පොදු පිටු (උදා: Sign-in පිටුව)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)']);

export default clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
        await auth.protect(); // පොදු පිටුවක් නොවේ නම් අනිවාර්යයෙන්ම Authentication පරීක්ෂා කරයි
    }
});

export const config = {
    matcher: [
        // Next.js internals සහ static ෆයිල්ස් හැර අනෙක් සියලුම දේ පරීක්ෂා කිරීමට
        '/((?!_next|[^?]*\\.[^?]*$$).*)',
        '/(api|trpc)(.*)',
    ],
};