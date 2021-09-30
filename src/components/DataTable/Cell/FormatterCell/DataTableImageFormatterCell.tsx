import React, { useMemo } from "react";
import { Image } from "semantic-ui-react";
import { ImageFormatterParams } from "../../types/formatter";
import { useDataTableImageFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

const defaultParams: ImageFormatterParams = {
    circular: false,
    bordered: false
};

export default function DataTableImageFormatterCell() {
    const {
        cell,
        column: {
            formatter: {
                params = defaultParams
            }
        }
    } = useDataTableImageFormatterCellContext();

    const {
        label,
        height,
        width,
        className,
        link,
        circular = false,
        bordered = false,
        urlPrefix,
        urlSuffix
    } = params;

    const formattedImage = useMemo(() => (
        <Image
            className={className}
            bordered={bordered}
            circular={circular}
            href={link}
            content={`${urlPrefix ?? ""}${cell}${urlSuffix ?? ""}`}
            label={label}
            style={{ width, height }}
        />
    ), [bordered, cell, circular, className, height, label, link, urlPrefix, urlSuffix, width]);

    return <DataTableBaseCell>{formattedImage}</DataTableBaseCell>;
}
