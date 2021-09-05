import React, { useMemo } from "react";
import { Progress } from "semantic-ui-react";
import { BaseCalcProgressFormatterParams } from "../../../types/formatter";
import { useDataTableCalcProgressFormatterCellContext } from "../../../utils/contexts/hooks";
import DataTableBaseCalcCell from "../DataTableBaseCalcCell";

const defaultParams: BaseCalcProgressFormatterParams = {
    progress: false,
    indicating: false
};

export default function DataTableCalcProgressFormatterCell() {
    const {
        cell,
        columnData,
        formatter: {
            params = defaultParams
        }
    } = useDataTableCalcProgressFormatterCellContext();

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

    const formattedProgress = useMemo(() => {
        return (
            <Progress
                className={className}
                label={label}
                progress={progress}
                indicating={indicating}
                success={success ? success(cell, columnData) : undefined}
                warning={warning ? warning(cell, columnData) : undefined}
                error={error ? error(cell, columnData) : undefined}
                style={color && { color }}
            />
        );
    }, [cell, className, color, error, indicating, label, progress, columnData, success, warning]);

    return <DataTableBaseCalcCell>{formattedProgress}</DataTableBaseCalcCell>;
}
