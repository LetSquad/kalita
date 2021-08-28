import React from "react";
import { useDataTableCellContext } from "../utils/contexts/hooks";
import DataTableBaseFormatterCell from "./FormatterCell/DataTableBaseFormatterCell";
import DataTableFormatterCell from "./FormatterCell/DataTableFormatterCell";

export default function DataTableCell() {
    const { column: { formatter } } = useDataTableCellContext();

    if (formatter) {
        return <DataTableFormatterCell />;
    }

    return <DataTableBaseFormatterCell />;
}
