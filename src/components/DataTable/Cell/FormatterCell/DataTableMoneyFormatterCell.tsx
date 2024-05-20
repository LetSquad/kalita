import { useCallback } from "react";

import DataTableDropdown from "../../Edit/DataTableDropdown";
import DataTableInput from "../../Edit/DataTableInput";
import { DropdownEdit, EditTypes, InputEdit } from "../../types/edit";
import { MoneyFormatterParams } from "../../types/formatter";
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

    const formatter = useCallback((_params: MoneyFormatterParams) => (value: number | string | undefined) => {
        if (value === undefined) {
            return value;
        }

        if (typeof value === "string") {
            const numberValue = Number(value);

            if (!Number.isNaN(numberValue)) {
                return formatMoneyFormatterValue({ ..._params, value: numberValue });
            }

            return value;
        }

        return formatMoneyFormatterValue({ ..._params, value });
    }, []);

    const editContent = useCallback((_edit: DropdownEdit<number> | InputEdit) => (_edit.type === EditTypes.INPUT
        ? (
            <DataTableInput
                params={{
                    ..._edit.params,
                    viewContentFormatter: (id, field, value) => (
                        formatter({ ...params, currency: undefined, additionalSpace: false })(value)
                    )
                }}
                label={params.currency}
            />
        )
        : <DataTableDropdown params={_edit.params} />), [formatter, params]);

    return edit
        ? <DataTableBaseCell>{editContent(edit)}</DataTableBaseCell>
        : <DataTableBaseCell>{formatter(params)(cell)}</DataTableBaseCell>;
}
