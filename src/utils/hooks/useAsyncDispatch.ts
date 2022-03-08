import { useCallback } from "react";

import { AnyAction } from "redux";

import { useAppDispatch } from "../../store/hooks";

/**
 *  Хук для оборачивания стандартного диспатча в ассинхронный тип redux-thunk + redux-promise-middleware
 */
export function useAsyncDispatch() {
    const dispatch = useAppDispatch();

    return useCallback(<S extends AnyAction>(action: S) => dispatch(action) as any as Promise<{
        action: Depromisify<S>,
        value: "payload" extends keyof S ? Depromisify<S["payload"]> : never
    }>, [dispatch]);
}

/**
 * Support-Type для разворачивания промисов
 */
export type Depromisify<T> = T extends Promise<infer R> ? R : T extends {
    [name: string]: any
} ? {
        [P in keyof T]: Depromisify<T[P]>
    } : T;
