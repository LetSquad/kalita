import React from "react";
import { useDataTableElementFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

export default function DataTableElementFormatterCell() {
    const {
        cell,
        id,
        row,
        column: {
            formatter: {
                params
            }
        }
    } = useDataTableElementFormatterCellContext();

    return <DataTableBaseCell>{params.renderElement(cell, id, row)}</DataTableBaseCell>;
}
