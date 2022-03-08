import { useDataTableCellContext } from "../utils/contexts/hooks";
import DataTableBaseFormatterCell from "./FormatterCell/DataTableBaseFormatterCell";
import DataTableFormatterCell from "./FormatterCell/DataTableFormatterCell";

export default function DataTableCell() {
    const { column } = useDataTableCellContext();

    if ("formatter" in column) {
        return <DataTableFormatterCell />;
    }

    return <DataTableBaseFormatterCell />;
}
