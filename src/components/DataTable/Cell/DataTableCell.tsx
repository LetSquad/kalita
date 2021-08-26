import React from "react";
import { useDataTableCellContext } from "../utils/contexts/hooks";
import DataTableBaseCell from "./DataTableBaseCell";
import DataTableElementCell from "./DataTableElementCell";
import DataTableEmptyCell from "./DataTableEmptyCell";

export default function DataTableCell() {
    const { row, column } = useDataTableCellContext();

    const { field, element } = column;
    if (element) {
        return <DataTableElementCell />;
    }
    if (field in row) {
        return <DataTableBaseCell />;
    }
    return <DataTableEmptyCell />;
}
