import { useMemo } from "react";

import { FormatterTypes } from "../../../types/formatter";
import { useDataTableCalcFormatterCellContext } from "../../../utils/contexts/hooks";
import DataTableBaseCalcCell from "../DataTableBaseCalcCell";
import DataTableCalcMoneyFormatterCell from "./DataTableCalcMoneyFormatterCell";
import DataTableCalcPercentageFormatterCell from "./DataTableCalcPercentageFormatterCell";
import DataTableCalcProgressFormatterCell from "./DataTableCalcProgressFormatterCell";
import DataTableCalcStarFormatterCell from "./DataTableCalcStarFormatterCell";

export default function DataTableCalcFormatterCell() {
    const { cell, formatter } = useDataTableCalcFormatterCellContext();

    const baseCell = useMemo(() => <DataTableBaseCalcCell>{cell}</DataTableBaseCalcCell>, [cell]);

    switch (formatter?.type) {
        case FormatterTypes.MONEY: {
            return typeof cell === "number" ? <DataTableCalcMoneyFormatterCell /> : baseCell;
        }
        case FormatterTypes.PERCENTAGE: {
            return typeof cell === "number" ? <DataTableCalcPercentageFormatterCell /> : baseCell;
        }
        case FormatterTypes.STAR: {
            return typeof cell === "number" ? <DataTableCalcStarFormatterCell /> : baseCell;
        }
        case FormatterTypes.PROGRESS: {
            return typeof cell === "number" ? <DataTableCalcProgressFormatterCell /> : baseCell;
        }
        default: {
            return baseCell;
        }
    }
}
