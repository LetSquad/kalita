import React, { useCallback, useMemo } from "react";
import DataTableDropdown from "../../Edit/DataTableDropdown";
import DataTableInput from "../../Edit/DataTableInput";
import { DropdownEdit, EditTypes, InputEdit } from "../../types/edit";
import { CurrencyPosition, MoneyFormatterParams } from "../../types/formatter";
import { useDataTableMoneyFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

const defaultParams: MoneyFormatterParams = {
    decimal: ".",
    thousand: ",",
    currency: "",
    currencyPosition: CurrencyPosition.AFTER,
    additionalSpace: false,
    precision: 2,
    zerosRemove: false
};

export default function DataTableMoneyFormatterCell() {
    const {
        cell,
        column: {
            formatter: {
                params = defaultParams
            },
            edit
        }
    } = useDataTableMoneyFormatterCellContext();

    const {
        decimal: decimalSym = ".",
        thousand: thousandSym = ",",
        currency = "",
        currencyPosition = CurrencyPosition.AFTER,
        additionalSpace = false,
        precision = 2,
        zerosRemove = false
    } = params;

    const formattedValue = useMemo(() => {
        let precisionValue: string | number = precision !== false ? cell.toFixed(precision) : cell;
        precisionValue = zerosRemove ? Number(precisionValue) : precisionValue;
        const formattedValues = String(precisionValue).split(".");

        let integer = formattedValues[0];
        const decimal = formattedValues.length > 1 ? decimalSym + formattedValues[1] : "";

        const rgx = /(\d+)(\d{3})/;

        while (rgx.test(integer)){
            integer = integer.replace(rgx, "$1" + thousandSym + "$2");
        }
        return currencyPosition === CurrencyPosition.BEFORE
            ? `${currency}${additionalSpace ? " " : ""}${integer}${decimal}`
            : `${integer}${decimal}${additionalSpace ? " " : ""}${currency}`;
    }, [additionalSpace, cell, currency, currencyPosition, decimalSym, precision, thousandSym, zerosRemove]);

    const editContent = useCallback((_edit: DropdownEdit<number> | InputEdit) => {
        return _edit.type === EditTypes.INPUT
            ? <DataTableInput params={_edit.params} label={currency} />
            : <DataTableDropdown params={_edit.params} />;
    }, [currency]);

    return edit
        ? <DataTableBaseCell>{editContent(edit)}</DataTableBaseCell>
        : <DataTableBaseCell>{formattedValue}</DataTableBaseCell>;
}
