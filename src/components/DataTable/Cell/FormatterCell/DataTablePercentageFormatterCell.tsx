import React, { useMemo } from "react";
import { DataTablePercentageFormatterCellParams } from "../../types/cell";
import { PercentageFormatterParams } from "../../types/formatter";
import { useDataTablePercentageFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

const defaultParams: PercentageFormatterParams = {
    additionalSpace: false,
    precision: 2,
    zerosRemove: false
};

export default function DataTablePercentageFormatterCell({ params = defaultParams }: DataTablePercentageFormatterCellParams) {
    const { cell } = useDataTablePercentageFormatterCellContext();

    const {
        additionalSpace = false,
        precision = 2,
        zerosRemove = false
    } = params;

    const formattedValue = useMemo(() => {
        let precisionValue: string | number = precision !== false ? cell.toFixed(precision) : cell;
        precisionValue = zerosRemove ? Number(precisionValue) : precisionValue;

        return `${precisionValue}${additionalSpace ? " " : ""}%`;
    }, [additionalSpace, cell, precision, zerosRemove]);

    return <DataTableBaseCell>{formattedValue}</DataTableBaseCell>;
}
