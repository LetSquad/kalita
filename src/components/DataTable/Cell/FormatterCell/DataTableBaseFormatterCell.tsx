import { useCallback, useMemo } from "react";

import DataTableDropdown from "../../Edit/DataTableDropdown";
import DataTableInput from "../../Edit/DataTableInput";
import { DropdownEdit, EditTypes, InputEdit } from "../../types/edit";
import { useDataTableBaseFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

export default function DataTableBaseFormatterCell() {
    const { cell, column: { edit } } = useDataTableBaseFormatterCellContext();

    const baseContent = useMemo(() => <DataTableBaseCell>{cell}</DataTableBaseCell>, [cell]);

    const editContent = useCallback((_edit: DropdownEdit | InputEdit) => (_edit.type === EditTypes.INPUT
        ? <DataTableInput params={_edit.params} />
        : <DataTableDropdown params={_edit.params} />), []);

    return edit
        ? <DataTableBaseCell>{editContent(edit)}</DataTableBaseCell>
        : baseContent;
}
