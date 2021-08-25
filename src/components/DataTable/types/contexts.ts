import { ColumnDefinition, DataTableData } from "./base";

export interface DataTableContext {
    columns: ColumnDefinition[];
    data: DataTableData[];
}
