import React, { useMemo } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDataTableBodyContext, useDataTableBodyGroupedContext, useDataTableContext } from "../utils/contexts/hooks";
import { groupData } from "../utils/utils";
import DataTableGroup from "./parts/DataTableGroup";

export default function DataTableGroupedBody() {
    const { data } = useDataTableContext();
    const { groupBy } = useDataTableBodyGroupedContext();
    const { onDragEnd } = useDataTableBodyContext();

    return useMemo(() => (
        <DragDropContext onDragEnd={onDragEnd}>
            {groupData(data, groupBy).map((group) => <DataTableGroup group={group} key={`group-${group.name}`} />)}
        </DragDropContext>
    ), [data, groupBy, onDragEnd]);
}
