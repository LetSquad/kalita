import { CSSProperties } from "react";

import { DataTableData, ExportToCsvOptions } from "../types/base";
import { ColumnDefinition, HorizontalAlignValues, VerticalAlignValues } from "../types/column";
import { GroupData } from "../types/group";

export function groupData(
    list: DataTableData[],
    field: keyof DataTableData
): GroupData[] {
    const groups: GroupData[] = [];
    for (const item of list) {
        const groupName = String(item[field]);
        const groupIndex = groups.findIndex(({ name }) => name === groupName);
        if (groupIndex === -1) {
            groups.push({
                name: groupName,
                data: [item]
            } as GroupData);
        } else {
            groups[groupIndex].data.push(item);
        }
    }
    return groups;
}

export function getCellCssStyleFromColumn({ width }: Pick<ColumnDefinition, "width">) {
    const cssProperties: CSSProperties = {};
    if (width !== undefined) {
        cssProperties.width = `${width}px`;
    }
    return cssProperties || undefined;
}

export function getHeaderCellContentCssStyleFromColumn({
    headerVertAlign,
    headerHozAlign
}: Pick<
ColumnDefinition,
"headerVertAlign" |
"headerHozAlign"
>) {
    const cssProperties: CSSProperties = {};
    if (headerVertAlign) {
        cssProperties.alignItems = getAlignFromEnum(headerVertAlign);
    }
    if (headerHozAlign) {
        cssProperties.justifyContent = getAlignFromEnum(headerHozAlign);
    }
    return cssProperties || undefined;
}

export function getCellContentCssStyleFromColumn({
    vertAlign,
    hozAlign
}: Pick<
ColumnDefinition,
"vertAlign" |
"hozAlign"
>) {
    const cssProperties: CSSProperties = {};
    if (vertAlign) {
        cssProperties.alignItems = getAlignFromEnum(vertAlign);
    }
    if (hozAlign) {
        cssProperties.justifyContent = getAlignFromEnum(hozAlign);
    }
    return cssProperties || undefined;
}

function getAlignFromEnum(alignValue: VerticalAlignValues | HorizontalAlignValues) {
    switch (alignValue) {
        case VerticalAlignValues.TOP:
        case HorizontalAlignValues.LEFT: {
            return "flex-start";
        }
        case VerticalAlignValues.MIDDLE:
        case HorizontalAlignValues.CENTER: {
            return "center";
        }
        case VerticalAlignValues.BOTTOM:
        case HorizontalAlignValues.RIGHT: {
            return "flex-end";
        }
    }
}

export function exportDataToCsv(
    data: DataTableData[],
    columns: ColumnDefinition[],
    groupBy?: keyof DataTableData,
    options?: ExportToCsvOptions
): string | undefined {
    const fields = columns.map((column) => {
        if (options?.includeEmptyTitle) {
            return column.field;
        }

        return column.title ? column.field : undefined;
    }).filter(Boolean) as (keyof DataTableData)[];

    const fieldsName = columns.filter((column) => fields.includes(column.field)).map((column) => `"${column.title?.replace("\"", "\"\"")}"`);

    if (options?.includeGroup && groupBy) {
        fields.push(groupBy as string);
        fieldsName.push("\"Группа\"");
    }
    const formattedData = data.map((row) => fields.map((field) => `"${row[field]?.toString().replace("\"", "\"\"")}"`).join(","));

    return `${fieldsName.join(",")}\n${formattedData.join("\n")}`;
}
