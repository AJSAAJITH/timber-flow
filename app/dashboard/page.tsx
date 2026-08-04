// app/dashboard/page.tsx
import React from "react";

import { getDashboardMetrics } from "@/actions/dashboard.action";
import DashboardPage from "./dashboard.clinet";

export const dynamic = "force-dynamic"; // Ensures fresh evaluation per request

export default async function Page() {
    // 💡 Fetch initial global data directly on the server before client rendering
    const res = await getDashboardMetrics("ALL");
    const initialData = res.success ? res.data : null;

    return (
        <div>
            <DashboardPage initialData={initialData} />
        </div>
    );
}