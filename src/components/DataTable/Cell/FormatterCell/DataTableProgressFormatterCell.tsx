import { useMemo } from "react";

import { Progress } from "semantic-ui-react";

import { BaseProgressFormatterParams } from "../../types/formatter";
import { useDataTableProgressFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

const defaultParams: BaseProgressFormatterParams = {
    progress: false,
    indicating: false
};

export default function DataTableProgressFormatterCell() {
    const {
        cell,
        row,
        id,
        column: {
            formatter: {
                params = defaultParams
            }
        }
    } = useDataTableProgressFormatterCellContext();

    const {
        label,
        progress = false,
        indicating = false,
        success,
        error,
        warning,
        className,
        color
    } = params;

    const formattedProgress = useMemo(() => (
        <Progress
            className={className}
            label={label}
            progress={progress}
            indicating={indicating}
            success={success ? success(cell, id, row) : undefined}
            warning={warning ? warning(cell, id, row) : undefined}
            error={error ? error(cell, id, row) : undefined}
            style={color && { color }}
        />
    ), [cell, className, color, error, id, indicating, label, progress, row, success, warning]);

    return <DataTableBaseCell>{formattedProgress}</DataTableBaseCell>;
}
