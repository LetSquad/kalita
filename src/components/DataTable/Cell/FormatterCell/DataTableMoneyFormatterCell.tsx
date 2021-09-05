import React, { useCallback } from "react";
import DataTableDropdown from "../../Edit/DataTableDropdown";
import DataTableInput from "../../Edit/DataTableInput";
import { DropdownEdit, EditTypes, InputEdit } from "../../types/edit";
import { useDataTableMoneyFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";
import { defaultMoneyFormatterParams, formatMoneyFormatterValue } from "../utils/formatterUtils";

export default function DataTableMoneyFormatterCell() {
    const {
        cell,
        column: {
            formatter: {
                params = defaultMoneyFormatterParams
            },
            edit
        }
    } = useDataTableMoneyFormatterCellContext();

    const editContent = useCallback((_edit: DropdownEdit<number> | InputEdit) => {
        return _edit.type === EditTypes.INPUT
            ? <DataTableInput params={_edit.params} label={params.currency} />
            : <DataTableDropdown params={_edit.params} />;
    }, [params.currency]);

    return edit
        ? <DataTableBaseCell>{editContent(edit)}</DataTableBaseCell>
        : <DataTableBaseCell>{formatMoneyFormatterValue({ ...params, value: cell })}</DataTableBaseCell>;
}
