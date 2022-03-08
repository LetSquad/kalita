import { useDataTableColorFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

export default function DataTableColorFormatterCell() {
    const { cell, style } = useDataTableColorFormatterCellContext();

    return (
        <DataTableBaseCell style={style ? { ...style, color: cell } : { color: cell }} />
    );
}
