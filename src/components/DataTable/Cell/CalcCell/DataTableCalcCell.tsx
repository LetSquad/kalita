import { useDataTableCalcCellContext } from "../../utils/contexts/hooks";
import DataTableBaseFormatterCell from "../FormatterCell/DataTableBaseFormatterCell";
import DataTableFormatterCell from "../FormatterCell/DataTableFormatterCell";

export default function DataTableCalcCell() {
    const { column } = useDataTableCalcCellContext();

    if ("formatter" in column) {
        return <DataTableFormatterCell />;
    }

    return <DataTableBaseFormatterCell />;
}
