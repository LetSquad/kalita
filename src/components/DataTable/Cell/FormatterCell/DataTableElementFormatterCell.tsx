import React from "react";
import { DataTableFormatterTypeCellParams } from "../../types/cell";
import { ElementFormatterParams } from "../../types/formatter";
import { useDataTableElementFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

export default function DataTableElementFormatterCell({ params }: DataTableFormatterTypeCellParams<ElementFormatterParams>) {
    const { cell, id, row } = useDataTableElementFormatterCellContext();

    return <DataTableBaseCell>{params.renderElement(cell, id, row)}</DataTableBaseCell>;
}
