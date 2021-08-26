import React, { useState } from "react";
import DataTableGroupRow from "../../Row/DataTableGroupRow";
import DataTableBaseRow from "../../Row/DataTableBaseRow";
import { DataTableGroupParams } from "../../types/group";

export default function DataTableGroup({ group: { name: groupName, data: rows } }: DataTableGroupParams) {
    const [state, setState] = useState<boolean>(true);

    return (
        <>
            <DataTableGroupRow groupName={groupName} expandState={state} setExpandState={setState} />
            {state && rows.map((row) => (
                <DataTableBaseRow row={row} key={row.id} />
            ))}
        </>
    );
}
