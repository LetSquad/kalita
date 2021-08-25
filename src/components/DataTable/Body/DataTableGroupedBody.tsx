import React, { useMemo } from "react";
import { useDataTableBodyGroupedContext, useDataTableContext } from "../utils/contexts/hooks";
import { groupData } from "../utils/utils";
import DataTableGroup from "./parts/DataTableGroup";

export default function DataTableGroupedBody() {
    const { data } = useDataTableContext();
    const { groupBy } = useDataTableBodyGroupedContext();

    return useMemo(() => (
        <>
            {groupData(data, groupBy).map((group) => <DataTableGroup group={group} key={`group-${group.name}`} />)}
        </>
    ), [data, groupBy]);
}
