import { useDataTableCalcPercentageFormatterCellContext } from "../../../utils/contexts/hooks";
import { defaultPercentageFormatterParams, formatPercentageFormatterValue } from "../../utils/formatterUtils";
import DataTableBaseCalcCell from "../DataTableBaseCalcCell";

export default function DataTableCalcPercentageFormatterCell() {
    const {
        cell,
        formatter: { params = defaultPercentageFormatterParams }
    } = useDataTableCalcPercentageFormatterCellContext();

    return <DataTableBaseCalcCell>{formatPercentageFormatterValue({ ...params, value: cell })}</DataTableBaseCalcCell>;
}
