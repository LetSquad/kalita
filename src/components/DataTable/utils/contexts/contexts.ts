import React from "react";
import { DataTableBodyParams } from "../../types/body";
import { DataTableContext as DataTableContextType } from "../../types/contexts";

export const DataTableContext = React.createContext<DataTableContextType | undefined>(undefined);

export const DataTableBodyContext = React.createContext<DataTableBodyParams | undefined>(undefined);
