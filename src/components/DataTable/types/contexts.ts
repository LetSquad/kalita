import { ColumnDefinition, DataTableData } from "./base";

export interface DataTableContextParams {
    columns: ColumnDefinition[];
    data: DataTableData[];
}
