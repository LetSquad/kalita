import React from "react";
import { DataTableBodyParams } from "../../types/body";
import { DataTableCellParams } from "../../types/cell";
import { DataTableContextParams } from "../../types/contexts";

export const DataTableContext = React.createContext<DataTableContextParams | undefined>(undefined);

export const DataTableBodyContext = React.createContext<DataTableBodyParams | undefined>(undefined);

export const DataTableCellContext = React.createContext<DataTableCellParams | undefined>(undefined);
