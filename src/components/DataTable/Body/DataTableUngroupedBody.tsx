import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Ref, Table } from "semantic-ui-react";

import DataTableBaseRow from "../Row/DataTableBaseRow";
import { useDataTableBodyContext, useDataTableContext } from "../utils/contexts/hooks";

export default function DataTableUngroupedBody() {
    const { data } = useDataTableContext();
    const { onDragEnd } = useDataTableBodyContext();

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="group">
                {(provided) => (
                    <Ref innerRef={provided.innerRef}>
                        <Table.Body
                            /* eslint-disable-next-line react/jsx-props-no-spreading */
                            {...provided.droppableProps}
                        >
                            {data.map((row) => (
                                <DataTableBaseRow
                                    row={row}
                                    key={row.id}
                                />
                            ))}
                            {provided.placeholder}
                        </Table.Body>
                    </Ref>
                )}
            </Droppable>
        </DragDropContext>
    );
}
