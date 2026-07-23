import { Customer, Product } from "../types/pos.types"


// Mock Products Database - TimberFlow Industrial Items
export const POS_MOCK_PRODUCTS: Product[] = [
    { id: "1", name: "Wood Pallet 48x40", sku: "WP-001", price: 2500, category: "Pallets", stock: 42 },
    { id: "2", name: "Treated Wood Board (2x4)", sku: "WB-001", price: 850, category: "Boards", stock: 128 },
    { id: "3", name: "Plastic Pallet 48x40", sku: "PP-001", price: 1500, category: "Plastics", stock: 0 },
    { id: "4", name: "Metal Angle 40x40x3mm", sku: "MA-001", price: 450, category: "Metal Items", stock: 186 },
    { id: "5", name: "Premium Wood Pallet", sku: "WP-003", price: 3200, category: "Pallets", stock: 25 },
    { id: "6", name: "Wood Board (1x12)", sku: "WB-002", price: 650, category: "Boards", stock: 64 },
    { id: "7", name: "Plastic Sheet 4x8ft", sku: "PS-001", price: 2200, category: "Plastics", stock: 12 },
    { id: "8", name: "Steel Channel 50x50", sku: "SC-001", price: 1200, category: "Metal Items", stock: 45 },
    { id: "9", name: "Plywood 4x8 Grade A", sku: "PW-001", price: 5400, category: "Boards", stock: 8 },
    { id: "10", name: "Metal Pipe 2 inch", sku: "MP-001", price: 3800, category: "Metal Items", stock: 35 },
]

export const CATEGORIES = ["All", "Pallets", "Boards", "Plastics", "Metal Items"]
export const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Credit"]

export const POS_MOCK_CUSTOMERS: Customer[] = [
    { id: "1", name: "Roshan Kumar", phone: "+94 777 123456" },
    { id: "2", name: "Priya Perera", phone: "+94 765 234567" },
    { id: "3", name: "Anura Silva", phone: "+94 712 345678" },
]