import React from "react";
import { useDataTableBaseFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

export default function DataTableBaseFormatterCell() {
    const { cell } = useDataTableBaseFormatterCellContext();

    return (
        <DataTableBaseCell>{cell}</DataTableBaseCell>
    );
}
