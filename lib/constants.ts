import { User } from "./types";

export const MOCK_USERS: User[] = [
    {
        id: "1",
        name: "Roshan Kumar",
        email: "roshan@timberflow.com",
        role: "SUPER_ADMIN",
        branch: "Main Branch",
        status: "active",
        joinedDate: "2024-01-15",
    },
    {
        id: "2",
        name: "Priya Perera",
        email: "priya@timberflow.com",
        role: "ADMIN",
        branch: "Negombo Branch",
        status: "active",
        joinedDate: "2024-02-20",
    },
    {
        id: "3",
        name: "Anura Silva",
        email: "anura@timberflow.com",
        role: "ADMIN",
        branch: "Galle Branch",
        status: "active",
        joinedDate: "2024-03-10",
    },
    {
        id: "4",
        name: "Nimal Jayasuriya",
        email: "nimal@timberflow.com",
        role: "CASHIER",
        branch: "Main Branch",
        status: "active",
        joinedDate: "2024-04-05",
    },
    {
        id: "5",
        name: "Lakshmi Wijesinghe",
        email: "lakshmi@timberflow.com",
        role: "CASHIER",
        branch: "Negombo Branch",
        status: "blocked",
        joinedDate: "2024-04-15",
    },
    {
        id: "6",
        name: "Keshan Bandara",
        email: "keshan@timberflow.com",
        role: "CASHIER",
        branch: "Galle Branch",
        status: "active",
        joinedDate: "2024-05-01",
    },
    {
        id: "7",
        name: "Samantha De Silva",
        email: "samantha@timberflow.com",
        role: "ADMIN",
        branch: "Kandy Branch",
        status: "active",
        joinedDate: "2024-05-10",
    },
    {
        id: "8",
        name: "Rajiv Menon",
        email: "rajiv@timberflow.com",
        role: "CASHIER",
        branch: "Kandy Branch",
        status: "blocked",
        joinedDate: "2024-05-20",
    },
]

export const MOCK_BRANCHES = [
    "Main Branch",
    "Negombo Branch",
    "Galle Branch",
    "Kandy Branch",
];

export const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
    SUPER_ADMIN: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
    ADMIN: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
    CASHIER: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
};

export function getInitials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}