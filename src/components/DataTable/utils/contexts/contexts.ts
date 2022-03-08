import { createContext } from "react";

import { DataTableBodyParams } from "../../types/body";
import { DataTableCalcRowParams } from "../../types/calc";
import { DataTableCalcCellParams, DataTableCellParams } from "../../types/cell";
import { DataTableContextParams } from "../../types/contexts";

export const DataTableContext = createContext<DataTableContextParams | undefined>(undefined);

export const DataTableBodyContext = createContext<DataTableBodyParams | undefined>(undefined);

export const DataTableCellContext = createContext<DataTableCellParams | undefined>(undefined);

export const DataTableCalcContext = createContext<DataTableCalcRowParams | undefined>(undefined);

export const DataTableCalcCellContext = createContext<DataTableCalcCellParams | undefined>(undefined);
