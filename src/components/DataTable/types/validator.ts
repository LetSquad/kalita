import { DataTableData } from "./base";
import { ValidationTooltip } from "./tooltip";

export interface Validator<T = string | number | boolean | undefined> {
    validate: ((
        tableData: DataTableData[],
        rowId: string,
        field: keyof DataTableData,
        oldValue: T,
        newValue: T,
        rowData: DataTableData
    ) => boolean) | boolean;
    tooltip?: ValidationTooltip
}
