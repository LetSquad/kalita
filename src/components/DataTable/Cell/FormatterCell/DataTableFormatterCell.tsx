import React, { useMemo } from "react";
import { FormatterTypes } from "../../types/formatter";
import { useDataTableFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";
import DataTableElementFormatterCell from "./DataTableElementFormatterCell";
import DataTableMoneyFormatterCell from "./DataTableMoneyFormatterCell";
import DataTablePercentageFormatterCell from "./DataTablePercentageFormatterCell";

export default function DataTableFormatterCell() {
    const { cell, column: { formatter } } = useDataTableFormatterCellContext();

    const baseCell = useMemo(() => <DataTableBaseCell>{cell}</DataTableBaseCell>, [cell]);

    switch (formatter?.type) {
        case FormatterTypes.ELEMENT: {
            return <DataTableElementFormatterCell params={formatter.params} />;
        }
        case FormatterTypes.MONEY: {
            return typeof cell === "number"
                ? <DataTableMoneyFormatterCell params={formatter.params} />
                : baseCell;
        }
        case FormatterTypes.PERCENTAGE: {
            return typeof cell === "number"
                ? <DataTablePercentageFormatterCell params={formatter.params} />
                : baseCell;
        }
        default: {
            return baseCell;
        }
    }
}
