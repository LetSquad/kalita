import React, { useCallback } from "react";
import { Icon } from "semantic-ui-react";
import { useAppDispatch } from "../../store/hooks";
import { deleteRowById } from "../../store/portfolios/portfoliosReducer";

interface NewActionBlockProps {
    rowId: string;
}

export function ActionBlock({ rowId }: NewActionBlockProps) {
    const dispatch = useAppDispatch();

    const deleteRow = useCallback(() => {
        dispatch(deleteRowById(rowId));
    }, [dispatch, rowId]);

    return (
        <div>
            <Icon name="remove" link onClick={deleteRow} />
        </div>
    );
}
