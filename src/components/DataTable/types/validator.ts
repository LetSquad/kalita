import { DataTableData } from "./base";
import { Tooltip } from "./tooltip";

export interface Validator {
    validate: ((
        rowId: string,
        cell: string | number | boolean | undefined,
        rowData: DataTableData
    ) => boolean) | boolean;
    tooltip?: Tooltip
}
