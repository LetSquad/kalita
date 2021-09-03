import React from "react";
import { Table } from "semantic-ui-react";
import DataTableCalcRow from "../Row/DataTableCalcRow";
import DataTableHeaderRow from "../Row/DataTableHeaderRow";
import { CalcPosition, CalcType } from "../types/calc";
import { DataTableCalcContext } from "../utils/contexts/contexts";
import { useDataTableContext } from "../utils/contexts/hooks";
import styles from "./styles/DataTableHeader.scss";

export default function DataTableHeader() {
    const { data } = useDataTableContext();

    return (
        <Table.Header className={styles.header}>
            <DataTableHeaderRow />
            <DataTableCalcContext.Provider
                value={{
                    position: CalcPosition.TOP,
                    type: CalcType.TABLE,
                    data
                }}
            >
                <DataTableCalcRow />
            </DataTableCalcContext.Provider>
        </Table.Header>
    );
}
