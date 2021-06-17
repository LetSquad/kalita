import React from "react";
import { Icon } from "semantic-ui-react";

export function ActionBlock(props: any) {
    const { cell, deleteRow } = props;

    return (
        <div>
            <Icon name="remove" link onClick={() => deleteRow(cell._cell.row.data.id)} />
        </div>
    );
}
