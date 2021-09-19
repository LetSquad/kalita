import React from "react";
import { useDataTableBodyContext } from "../utils/contexts/hooks";
import DataTableGroupedBody from "./DataTableGroupedBody";
import DataTableUngroupedBody from "./DataTableUngroupedBody";

export default function DataTableBody() {
    const { groupBy } = useDataTableBodyContext();
    return (
        groupBy
            ? <DataTableGroupedBody />
            : <DataTableUngroupedBody />

    );
}
