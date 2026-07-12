export interface User {
    id: string
    name: string
    email: string
    role: "SUPER_ADMIN" | "ADMIN" | "CASHIER"
    branch: string
    status: "active" | "blocked"
    joinedDate: string
}


export interface Stats {
    total: number;
    admins: number;
}