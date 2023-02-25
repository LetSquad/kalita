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

    const formatter = useCallback((value: number | string | undefined) => {
        if (value === undefined) {
            return value;
        }

        if (typeof value === "string") {
            const numberValue = Number(value);

            if (!Number.isNaN(numberValue)) {
                return formatPercentageFormatterValue({ ...params, value: numberValue });
            }

            return value;
        }

        return formatPercentageFormatterValue({ ...params, value });
    }, [params]);

    const editContent = useCallback((_edit: DropdownEdit<number> | InputEdit) => (_edit.type === EditTypes.INPUT
        ? (
            <DataTableInput
                params={{ ..._edit.params, formatter }}
                label="%"
            />
        )
        : <DataTableDropdown params={_edit.params} />), [formatter]);

    return edit
        ? <DataTableBaseCell>{editContent(edit)}</DataTableBaseCell>
        : <DataTableBaseCell>{formatter(cell)}</DataTableBaseCell>;
}
