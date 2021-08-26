import React, { useCallback } from "react";
import { Icon } from "semantic-ui-react";
import { useAppDispatch } from "../../store/hooks";
import { deleteRowById } from "../../store/portfolios/portfoliosReducer";
import { DataTableData } from "../DataTable/types/base";

interface NewActionBlockProps {
    rowData: DataTableData;
}

export function NewActionBlock({ rowData }: NewActionBlockProps) {
    const dispatch = useAppDispatch();

    const deleteRow = useCallback((id: string) => {
        dispatch(deleteRowById(id));
    }, [dispatch]);

    return (
        <div>
            <Icon name="remove" link onClick={() => deleteRow(rowData.id)} />
        </div>
    );
}
