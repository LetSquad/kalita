import React, { useCallback, useMemo } from "react";
import DataTableDropdown from "../../Edit/DataTableDropdown";
import DataTableInput from "../../Edit/DataTableInput";
import { DropdownEdit, EditTypes, InputEdit } from "../../types/edit";
import { PercentageFormatterParams } from "../../types/formatter";
import { useDataTablePercentageFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

const defaultParams: PercentageFormatterParams = {
    additionalSpace: false,
    precision: 2,
    zerosRemove: false
};

export default function DataTablePercentageFormatterCell() {
    const {
        cell,
        column: {
            formatter: {
                params = defaultParams
            },
            edit
        }
    } = useDataTablePercentageFormatterCellContext();

    const {
        additionalSpace = false,
        precision = 2,
        zerosRemove = false
    } = params;

    const formattedValue = useMemo(() => {
        let precisionValue: string | number = precision !== false ? cell.toFixed(precision) : cell;
        precisionValue = zerosRemove ? Number(precisionValue) : precisionValue;

        return `${precisionValue}${additionalSpace ? " " : ""}%`;
    }, [additionalSpace, cell, precision, zerosRemove]);

    const editContent = useCallback((_edit: DropdownEdit<number> | InputEdit) => {
        return _edit.type === EditTypes.INPUT
            ? <DataTableInput params={_edit.params} label="%" />
            : <DataTableDropdown params={_edit.params} />;
    }, []);

    return edit
        ? <DataTableBaseCell>{editContent(edit)}</DataTableBaseCell>
        : <DataTableBaseCell>{formattedValue}</DataTableBaseCell>;
}
