import React, { useCallback } from "react";
import { Icon } from "semantic-ui-react";
import { useAppDispatch } from "../../store/hooks";
import { deleteRowById } from "../../store/portfolios/portfoliosReducer";

interface ActionBlockProps {
    rowId: string;
}

export function ActionBlock({ rowId }: ActionBlockProps) {
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
