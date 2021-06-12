export interface TabulatorColumn {
    title: string,
    field: string,
    visible?: boolean,
    hozAlign?: "left" | "center" | "right",
    vertAlign?: "top" | "middle" | "bottom",
    width?: number,
    minWidth?: number,
    maxWidth?: number,
    widthGrow?: number,
    widthShrink?: number,
    resizable?: boolean,
    frozen?: boolean,
    responsive?: number,
    tooltip?: (cell: any) => string,
    cssClass?: string,
    formatter?: "plaintext" | "textarea" | "html" | "money" | "image" | "link" | "datetime" | "datetimediff"
    | "tickCross" | "color" | "star" | "traffic" | "progress" | "lookup" | "buttonTick" | "buttonCross" | "rownum"
    | "handle",
    headerSort?: boolean,
    headerHozAlign?: "left" | "center" | "right",
    headerTooltip?: string,
    sorter?: "string" | "number" | "alphanum" | "boolean" | "exists" | "date" | "time" | "datetime" | "array",
    [key: string]: any
}

export interface TableData {
    id: string,
    name: string,
    weight: number,
    share: number,
    targetAmount: number,
    price: number,
    targetQuantity: number,
    briefcase: number,
    amount: number,
    groupName: string
}
