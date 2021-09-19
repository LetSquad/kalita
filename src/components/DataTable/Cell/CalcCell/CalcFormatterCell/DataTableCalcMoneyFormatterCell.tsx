import React from "react";
import { useDataTableCalcMoneyFormatterCellContext } from "../../../utils/contexts/hooks";
import { defaultMoneyFormatterParams, formatMoneyFormatterValue } from "../../utils/formatterUtils";
import DataTableBaseCalcCell from "../DataTableBaseCalcCell";

export default function DataTableCalcMoneyFormatterCell() {
    const { cell, formatter: { params = defaultMoneyFormatterParams } } = useDataTableCalcMoneyFormatterCellContext();

    return <DataTableBaseCalcCell>{formatMoneyFormatterValue({ ...params, value: cell })}</DataTableBaseCalcCell>;
}
