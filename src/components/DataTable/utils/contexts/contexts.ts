import React from "react";
import { DataTableBodyParams } from "../../types/body";
import { DataTableCalcRowParams } from "../../types/calc";
import { DataTableCalcCellParams, DataTableCellParams } from "../../types/cell";
import { DataTableContextParams } from "../../types/contexts";

export const DataTableContext = React.createContext<DataTableContextParams | undefined>(undefined);

export const DataTableBodyContext = React.createContext<DataTableBodyParams | undefined>(undefined);

export const DataTableCellContext = React.createContext<DataTableCellParams | undefined>(undefined);

export const DataTableCalcContext = React.createContext<DataTableCalcRowParams | undefined>(undefined);

export const DataTableCalcCellContext = React.createContext<DataTableCalcCellParams | undefined>(undefined);
