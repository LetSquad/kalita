import { useMemo } from "react";

import classNames from "classnames";
import { Table } from "semantic-ui-react";

import DataTableCalcRow from "../Row/DataTableCalcRow";
import { CalcPosition, CalcType } from "../types/calc";
import { DataTableCalcContext } from "../utils/contexts/contexts";
import { useDataTableContext } from "../utils/contexts/hooks";
import styles from "./styles/DataTableFooter.scss";

export default function DataTableFooter() {
    const { data, classes } = useDataTableContext();

    const dataTableCalcContextValues = useMemo(() => ({
        position: CalcPosition.BOTTOM,
        type: CalcType.TABLE,
        data
    }), [data]);

    return (
        <Table.Footer className={classNames(styles.footer, classes?.footerClassName)}>
            <DataTableCalcContext.Provider value={dataTableCalcContextValues}>
                <DataTableCalcRow />
            </DataTableCalcContext.Provider>
        </Table.Footer>
    );
}
