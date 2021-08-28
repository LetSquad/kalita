import React, { useMemo } from "react";
import { DataTableLinkFormatterCellParams } from "../../types/cell";
import { useDataTableLinkFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

export default function DataTableLinkFormatterCell({ params }: DataTableLinkFormatterCellParams) {
    const { cell } = useDataTableLinkFormatterCellContext();

    const formattedLink = useMemo(() => {
        const link = `${params?.urlPrefix ?? ""}${cell}${params?.urlSuffix ?? ""}`;

        return (
            <a href={link} target={params?.target} className={params?.className}>
                {params?.label ?? link}
            </a>
        );
    }, [cell, params]);

    return <DataTableBaseCell>{formattedLink}</DataTableBaseCell>;
}
