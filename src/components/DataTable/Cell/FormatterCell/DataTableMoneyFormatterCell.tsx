import { useCallback } from "react";

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

    const formatter = useCallback((value: number | string | undefined) => {
        if (value === undefined) {
            return value;
        }

        if (typeof value === "string") {
            const numberValue = Number(value);

            if (!Number.isNaN(numberValue)) {
                return formatMoneyFormatterValue({ ...params, value: numberValue });
            }

            return value;
        }

        return formatMoneyFormatterValue({ ...params, value });
    }, [params]);

    const editContent = useCallback((_edit: DropdownEdit<number> | InputEdit) => (_edit.type === EditTypes.INPUT
        ? (
            <DataTableInput
                params={{ ..._edit.params, formatter }}
                label={params.currency}
            />
        )
        : <DataTableDropdown params={_edit.params} />), [formatter, params.currency]);

    return edit
        ? <DataTableBaseCell>{editContent(edit)}</DataTableBaseCell>
        : <DataTableBaseCell>{formatter(cell)}</DataTableBaseCell>;
}
