import React from "react";
import { FormatterTypes } from "../../types/formatter";
import { useDataTableFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";
import DataTableElementFormatterCell from "./DataTableElementFormatterCell";

export default function DataTableFormatterCell() {
    const { cell, column: { formatter } } = useDataTableFormatterCellContext();

    switch (formatter?.type) {
        case FormatterTypes.ELEMENT: {
            return <DataTableElementFormatterCell params={formatter.params} />;
        }
        default: {
            return <DataTableBaseCell>{cell}</DataTableBaseCell>;
        }
    }
}
