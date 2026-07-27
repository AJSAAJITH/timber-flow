import { ActionResult } from "./action-result";

// ActionResult හි success: false වන අවස්ථාවේ code type එක Extract කර ගැනීම
type ErrorCode = Extract<ActionResult<never>, { success: false }>["code"];

// Success Response Helper
export function actionSuccess<T>(data: T, message?: string): ActionResult<T> {
    return {
        success: true,
        data,
        message,
    };
}

// Error Response Helper
export function actionError<T = void>(
    error: string,
    code?: ErrorCode,
    fieldErrors?: Record<string, string[]>
): ActionResult<T> {
    return {
        success: false,
        error,
        code,
        fieldErrors,
    };
}