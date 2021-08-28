import React, { useMemo } from "react";
import { DataTableFormatterTypeCellParams } from "../../types/cell";
import { LinkFormatterParams } from "../../types/formatter";
import { useDataTableLinkFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

export default function DataTableLinkFormatterCell({ params }: DataTableFormatterTypeCellParams<LinkFormatterParams | undefined>) {
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
