import React from "react";
import { Table } from "semantic-ui-react";
import { DataTableBaseCellParams } from "../types/cell";
import baseStyles from "../styles/base.scss";
import { useDataTableBaseCellContext } from "../utils/contexts/hooks";

export default function DataTableBaseCell({ children, style, className }: DataTableBaseCellParams) {
    const { style: defaultStyle } = useDataTableBaseCellContext();

    return <Table.Cell className={className ?? baseStyles.baseCell} style={style ?? defaultStyle}>{children}</Table.Cell>;
}
