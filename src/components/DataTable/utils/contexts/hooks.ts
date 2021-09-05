import { useContext } from "react";
import { DataTableBodyParams, DataTableGroupedBodyParams } from "../../types/body";
import { CalcType, DataTableCalcRowParams } from "../../types/calc";
import {
    DataTableBaseCalcCellParams,
    DataTableCalcCellParams,
    DataTableCalcFormatterCellParams,
    DataTableCellParams,
    DataTableFormatterCellParams
} from "../../types/cell";
import {
    ImageFormatterColumnDefinition,
    LinkFormatterColumnDefinition,
    MoneyFormatterColumnDefinition,
    PercentageFormatterColumnDefinition,
    ProgressFormatterColumnDefinition,
    StarFormatterColumnDefinition
} from "../../types/column";
import {
    DataTableBaseCellContextParams,
    DataTableColorCellFormatterContextParams,
    DataTableContextParams,
    DataTableEditCellContextParams,
    DataTableEditCellFormatterContextParams,
    DataTableEditContextParams,
    DataTableElementCellFormatterContextParams,
    DataTableNotEditCellFormatterContextParams
} from "../../types/contexts";
import {
    MoneyFormatter,
    PercentageFormatter,
    ProgressCalcFormatter,
    StarFormatter
} from "../../types/formatter";
import {
    DataTableBodyContext,
    DataTableCalcCellContext,
    DataTableCalcContext,
    DataTableCellContext,
    DataTableContext
} from "./contexts";

export function useDataTableContext() {
    return useContext(DataTableContext) as DataTableContextParams;
}

export function useDataTableBodyContext() {
    return useContext(DataTableBodyContext) as DataTableBodyParams;
}

export function useDataTableBodyGroupedContext() {
    return useContext(DataTableBodyContext) as DataTableGroupedBodyParams;
}

export function useDataTableCellContext() {
    return useContext(DataTableCellContext) as DataTableCellParams;
}

export function useDataTableBaseCellContext() {
    return useContext(DataTableCellContext) as DataTableBaseCellContextParams;
}

export function useDataTableFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableFormatterCellParams;
}

export function useDataTableBaseFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableEditCellContextParams<string | number | undefined>;
}

export function useDataTableElementFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableElementCellFormatterContextParams<string | number | undefined>;
}

export function useDataTableMoneyFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableEditCellFormatterContextParams<number, MoneyFormatterColumnDefinition>;
}

export function useDataTablePercentageFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableEditCellFormatterContextParams<number, PercentageFormatterColumnDefinition>;
}

export function useDataTableLinkFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableNotEditCellFormatterContextParams<
    string | number,
    LinkFormatterColumnDefinition
    >;
}

export function useDataTableColorFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableColorCellFormatterContextParams;
}

export function useDataTableImageFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableNotEditCellFormatterContextParams<
    string | number,
    ImageFormatterColumnDefinition
    >;
}

export function useDataTableStarFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableEditCellFormatterContextParams<number, StarFormatterColumnDefinition>;
}

export function useDataTableProgressFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableNotEditCellFormatterContextParams<number, ProgressFormatterColumnDefinition>;
}

export function useDataTableEditContext() {
    return useContext(DataTableCellContext) as DataTableEditContextParams<number | string | undefined>;
}

export function useDataTableCalcContext() {
    return useContext(DataTableCalcContext) as DataTableCalcRowParams;
}

export function useDataTableCalcCellContext() {
    return useContext(DataTableCalcCellContext) as DataTableCalcCellParams;
}

export function useDataTableBaseCalcCellContext() {
    return useContext(DataTableCalcCellContext) as DataTableBaseCalcCellParams;
}

export function useDataTableCalcFormatterCellContext() {
    const context = useContext(DataTableCalcCellContext) as DataTableCalcCellParams;
    if (context.calcType === CalcType.TABLE) {
        return { cell: context.cell, formatter: context.column.tableCalc?.formatter } as DataTableCalcFormatterCellParams;
    }

    return { cell: context.cell, formatter: context.column.groupCalc?.formatter } as DataTableCalcFormatterCellParams;
}

export function useDataTableCalcMoneyFormatterCellContext() {
    return useDataTableCalcFormatterCellContext() as DataTableCalcFormatterCellParams<number, MoneyFormatter>;
}

export function useDataTableCalcPercentageFormatterCellContext() {
    return useDataTableCalcFormatterCellContext() as DataTableCalcFormatterCellParams<number, PercentageFormatter>;
}

export function useDataTableCalcProgressFormatterCellContext() {
    return useDataTableCalcFormatterCellContext() as DataTableCalcFormatterCellParams<number, ProgressCalcFormatter>;
}

export function useDataTableCalcStarFormatterCellContext() {
    return useDataTableCalcFormatterCellContext() as DataTableCalcFormatterCellParams<number, StarFormatter>;
}
