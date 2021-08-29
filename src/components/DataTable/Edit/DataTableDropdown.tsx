import React from "react";
import { Dropdown } from "semantic-ui-react";
import { DataTableDropdownParams } from "../types/edit";

export default function DataTableDropdown<T>({ params }: DataTableDropdownParams<T>) {
    return (
        <Dropdown />
    );
}
