import React from "react";
import { Table } from "semantic-ui-react";
import baseStyles from "../styles/base.scss";
import { useDataTableEmptyCellContext } from "../utils/contexts/hooks";

export default function DataTableEmptyCell() {
    const { style } = useDataTableEmptyCellContext();

    return <Table.Cell className={baseStyles.baseCell} style={style} />;
}
