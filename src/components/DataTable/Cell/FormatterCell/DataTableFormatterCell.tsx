import { useMemo } from "react";

import { FormatterTypes } from "../../types/formatter";
import { useDataTableFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";
import DataTableColorFormatterCell from "./DataTableColorFormatterCell";
import DataTableElementFormatterCell from "./DataTableElementFormatterCell";
import DataTableImageFormatterCell from "./DataTableImageFormatterCell";
import DataTableLinkFormatterCell from "./DataTableLinkFormatterCell";
import DataTableMoneyFormatterCell from "./DataTableMoneyFormatterCell";
import DataTablePercentageFormatterCell from "./DataTablePercentageFormatterCell";
import DataTableProgressFormatterCell from "./DataTableProgressFormatterCell";
import DataTableStarFormatterCell from "./DataTableStarFormatterCell";

export default function DataTableFormatterCell() {
    const { cell, column: { formatter } } = useDataTableFormatterCellContext();

    const baseCell = useMemo(() => <DataTableBaseCell>{cell}</DataTableBaseCell>, [cell]);

    switch (formatter?.type) {
        case FormatterTypes.ELEMENT: {
            return <DataTableElementFormatterCell />;
        }
        case FormatterTypes.MONEY: {
            return typeof cell === "number" ? <DataTableMoneyFormatterCell /> : baseCell;
        }
        case FormatterTypes.PERCENTAGE: {
            return typeof cell === "number" ? <DataTablePercentageFormatterCell /> : baseCell;
        }
        case FormatterTypes.LINK: {
            return cell === undefined ? baseCell : <DataTableLinkFormatterCell />;
        }
        case FormatterTypes.COLOR: {
            return typeof cell === "string" ? <DataTableColorFormatterCell /> : baseCell;
        }
        case FormatterTypes.IMAGE: {
            return cell === undefined ? baseCell : <DataTableImageFormatterCell />;
        }
        case FormatterTypes.STAR: {
            return typeof cell === "number" ? <DataTableStarFormatterCell /> : baseCell;
        }
        case FormatterTypes.PROGRESS: {
            return typeof cell === "number" ? <DataTableProgressFormatterCell /> : baseCell;
        }
    }
}
