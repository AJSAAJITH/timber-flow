// src/types/action-result.ts

export type ActionResult<T = void> =
    | {
        success: true;
        data: T;
        message?: string;
    }
    | {
        success: false;
        error: string;
        code?: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR" | "CLERK_ERROR" | "BAD_REQUEST" | "SERVER_ERROR";
        fieldErrors?: Record<string, string[]>; // Form validation errors සඳහා (e.g., { name: ["Name is required"] })
    };