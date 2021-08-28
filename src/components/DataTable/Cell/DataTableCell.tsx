import React from "react";
import { useDataTableCellContext } from "../utils/contexts/hooks";
import DataTableBaseCell from "./DataTableBaseCell";
import DataTableFormatterCell from "./FormatterCell/DataTableFormatterCell";

export default function DataTableCell() {
    const { cell, column: { formatter } } = useDataTableCellContext();

    if (formatter) {
        return <DataTableFormatterCell />;
    }

    return <DataTableBaseCell>{cell}</DataTableBaseCell>;
}
