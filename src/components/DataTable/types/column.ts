import { Formatter } from "./formatter";

export interface ColumnDefinition {
    field: string;
    title?: string;
    formatter?: Formatter;
    width?: number;
}
