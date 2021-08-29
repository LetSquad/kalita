import React from "react";
import { Dropdown } from "semantic-ui-react";
import { DataTableDropdownParams } from "../types/edit";
import { useDataTableBodyContext, useDataTableEditContext } from "../utils/contexts/hooks";

export default function DataTableDropdown<T>({ params }: DataTableDropdownParams<T>) {
    const { cell, id, column: { field } } = useDataTableEditContext();
    const { onCellChanged: onGlobalCellChanged } = useDataTableBodyContext();

    const {
        multiple = false,
        search = false,
        clearable = false,
        inline = false,
        placeholder,
        onCellChange,
        options
    } = params;

    return (
        <Dropdown
            defaultValue={onCellChange || onGlobalCellChanged ? undefined : cell}
            value={onCellChange || onGlobalCellChanged ? cell : undefined}
            multiple={multiple}
            search={search}
            clearable={clearable}
            inline={inline}
            placeholder={placeholder}
            options={options}
            onChange={((event, data) => {
                if (onCellChange) {
                    onCellChange(id, field, event, data.value as unknown as T);
                }
                if (onGlobalCellChanged) {
                    onGlobalCellChanged(id, field, event, data.value as string | number | boolean | undefined);
                }
            })}
        />
    );
}
