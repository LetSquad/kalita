import React from "react";
import { Table } from "semantic-ui-react";
import baseStyles from "../styles/base.scss";

export default function DataTableEmptyCell() {
    return <Table.Cell className={baseStyles.baseCell} />;
}
