import React from "react";
import { DataTableElementFormatterCellParams } from "../../types/cell";
import { useDataTableElementFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

export default function DataTableElementFormatterCell({ params }: DataTableElementFormatterCellParams) {
    const { cell, id, row } = useDataTableElementFormatterCellContext();

    return <DataTableBaseCell>{params.renderElement(cell, id, row)}</DataTableBaseCell>;
}
