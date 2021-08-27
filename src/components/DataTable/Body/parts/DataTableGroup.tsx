import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Ref, Table } from "semantic-ui-react";
import DataTableGroupRow from "../../Row/DataTableGroupRow";
import DataTableBaseRow from "../../Row/DataTableBaseRow";
import { DataTableGroupParams } from "../../types/group";

export default function DataTableGroup({ group: { name: groupName, data: rows } }: DataTableGroupParams) {
    const [state, setState] = useState<boolean>(true);

    return (
        <Droppable droppableId={groupName}>
            {(provided) => (
                <Ref innerRef={provided.innerRef}>
                    <Table.Body
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        {...provided.droppableProps}
                    >
                        <DataTableGroupRow groupName={groupName} expandState={state} setExpandState={setState} />
                        {state && rows.map((row) => (
                            <DataTableBaseRow row={row} key={row.id} />
                        ))}
                        {provided.placeholder}
                    </Table.Body>
                </Ref>
            )}
        </Droppable>
    );
}
