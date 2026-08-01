"use server";

import prisma from "@/lib/prisma";
import { StockLog } from "@/lib/types";
import { actionError, actionSuccess } from "@/lib/types/action-response";
import { ActionResult } from "@/lib/types/action-result";

export async function getStockLogs(): Promise<ActionResult<StockLog[]>> {
    try {
        const logs = await prisma.inventoryLog.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 100, // Performance සඳහා ලොග් 100 කට සීමා කර ඇත
            include: {
                branch: true,   // InventoryLog -> Branch relation
                product: true,  // InventoryLog -> Product relation
            },
        });

        // Prisma Data එක UI එකේ StockLog Type එකට Map කිරීම
        const formattedLogs: StockLog[] = logs.map((log) => ({
            id: log.id,
            branchId: log.branchId, // 💡 branchId එක Direct ලෙස UI එකට Pass කරන ලදී
            product: log.product?.name || "Unknown Product",
            branch: log.branch?.name || "Unknown Branch",
            quantity: log.quantity,
            logType: log.type as StockLog["logType"],
            timestamp: new Date(log.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
            }),
            note: log.note || "",
        }));

        return actionSuccess(formattedLogs);
    } catch (error) {
        console.error("Error fetching stock logs:", error);
        return actionError("Stock logs ලබා ගැනීමට අපොහොසත් විය.", "SERVER_ERROR");
    }
}