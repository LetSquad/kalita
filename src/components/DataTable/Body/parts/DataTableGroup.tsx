import { useMemo, useState } from "react";

import { Droppable } from "react-beautiful-dnd";
import { Ref, Table } from "semantic-ui-react";

import DataTableBaseRow from "../../Row/DataTableBaseRow";
import DataTableCalcRow from "../../Row/DataTableCalcRow";
import DataTableGroupRow from "../../Row/DataTableGroupRow";
import { CalcPosition, CalcType } from "../../types/calc";
import { DataTableGroupParams } from "../../types/group";
import { DataTableCalcContext } from "../../utils/contexts/contexts";

export default function DataTableGroup({ group: { name: groupName, data: rows } }: DataTableGroupParams) {
    const [state, setState] = useState<boolean>(true);

    const topDataTableCalcContextValues = useMemo(() => ({
        position: CalcPosition.TOP,
        type: CalcType.GROUP,
        data: rows
    }), [rows]);

    const bottomDataTableCalcContextValues = useMemo(() => ({
        position: CalcPosition.BOTTOM,
        type: CalcType.GROUP,
        data: rows
    }), [rows]);

    return (
        <Droppable droppableId={groupName}>
            {(provided) => (
                <Ref innerRef={provided.innerRef}>
                    <Table.Body
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        {...provided.droppableProps}
                    >
                        <DataTableGroupRow
                            groupName={groupName}
                            expandState={state}
                            setExpandState={setState}
                        />
                        <DataTableCalcContext.Provider value={topDataTableCalcContextValues}>
                            <DataTableCalcRow />
                        </DataTableCalcContext.Provider>
                        {state && rows.map((row) => (
                            <DataTableBaseRow
                                row={row}
                                key={row.id}
                            />
                        ))}
                        {provided.placeholder}
                        <DataTableCalcContext.Provider
                            value={bottomDataTableCalcContextValues}
                        >
                            <DataTableCalcRow />
                        </DataTableCalcContext.Provider>
                    </Table.Body>
                </Ref>
            )}
        </Droppable>
    );
}
