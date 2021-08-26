import React from "react";
import { useDataTableContext } from "../utils/contexts/hooks";
import DataTableBaseRow from "../Row/DataTableBaseRow";

export default function DataTableUngroupedBody() {
    const { data } = useDataTableContext();

    return (
        <>
            {data.map((row) => (
                <DataTableBaseRow row={row} key={row.id} />
            ))}
        </>
    );
}
