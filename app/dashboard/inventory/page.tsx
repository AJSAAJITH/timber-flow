// src/app/inventory/page.tsx (හෝ ඔබේ Server Component file එක)
import { getBranches, getCatalogProducts } from "@/actions/inventory/brach-stock.action";
import { getCategories } from "@/actions/inventory/category.action";
import { getStockLogs } from "@/actions/inventory/stock-log.action"; // 👈 Action එක Import කරන්න

import InventoryClientPage from "./inventory.client";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
    const [branchesRes, catalogProductsRes, categoriesRes, logsRes] = await Promise.all([
        getBranches(),
        getCatalogProducts(),
        getCategories(),
        getStockLogs(), // 👈 Stock Logs fetch කිරීම
    ]);

    // Console Errors
    if (!branchesRes.success) console.error("Branches Fetch Error:", branchesRes.error);
    if (!catalogProductsRes.success) console.error("Catalog Products Fetch Error:", catalogProductsRes.error);
    if (!categoriesRes.success) console.error("Categories Fetch Error:", categoriesRes.error);
    if (!logsRes.success) console.error("Stock Logs Fetch Error:", logsRes.error);

    const initialBranches = branchesRes.success && branchesRes.data ? branchesRes.data : [];
    const initialCatalogProducts = catalogProductsRes.success && catalogProductsRes.data ? catalogProductsRes.data : [];
    const initialCategories = categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
    const initialLogs = logsRes.success && logsRes.data ? logsRes.data : []; // 👈 Logs Data Extract කර ගැනීම

    return (
        <InventoryClientPage
            initialBranches={initialBranches}
            initialCatalogProducts={initialCatalogProducts}
            categories={initialCategories}
            initialLogs={initialLogs} // 👈 Client Component එකට Pass කිරීම
        />
    );
}