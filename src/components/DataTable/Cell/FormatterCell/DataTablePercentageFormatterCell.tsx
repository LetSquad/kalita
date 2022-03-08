import { useCallback } from "react";

import DataTableDropdown from "../../Edit/DataTableDropdown";
import DataTableInput from "../../Edit/DataTableInput";
import { DropdownEdit, EditTypes, InputEdit } from "../../types/edit";
import { useDataTablePercentageFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";
import { defaultPercentageFormatterParams, formatPercentageFormatterValue } from "../utils/formatterUtils";

export default function DataTablePercentageFormatterCell() {
    const {
        cell,
        column: {
            formatter: {
                params = defaultPercentageFormatterParams
            },
            edit
        }
    } = useDataTablePercentageFormatterCellContext();

    const editContent = useCallback((_edit: DropdownEdit<number> | InputEdit) => (_edit.type === EditTypes.INPUT
        ? (
            <DataTableInput
                params={_edit.params}
                label="%"
            />
        )
        : <DataTableDropdown params={_edit.params} />), []);

    return edit
        ? <DataTableBaseCell>{editContent(edit)}</DataTableBaseCell>
        : <DataTableBaseCell>{formatPercentageFormatterValue({ ...params, value: cell })}</DataTableBaseCell>;
}
