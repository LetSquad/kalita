import { useDataTableElementFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

export default function DataTableElementFormatterCell() {
    const {
        cell,
        id,
        row,
        column: {
            formatter: {
                params
            },
            field
        }
    } = useDataTableElementFormatterCellContext();

    return <DataTableBaseCell withWrapper={false}>{params.renderElement(id, field, cell, row)}</DataTableBaseCell>;
}
