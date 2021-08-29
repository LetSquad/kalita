import classNames from "classnames";
import React, { FocusEvent, MouseEvent } from "react";
import { Icon, Input } from "semantic-ui-react";
import { DataTableInputParams } from "../types/edit";
import { useDataTableBodyContext, useDataTableEditContext } from "../utils/contexts/hooks";
import styles from "./styles/DataTableInput.scss";

const defaultParams = {
    transparent: false,
    clearable: false,
    dashed: false
};

export default function DataTableInput({ params = defaultParams, label }: DataTableInputParams) {
    const { cell, id, column: { field } } = useDataTableEditContext();
    const { onCellChanged: onGlobalCellChanged, onCellBlur: onGlobalCellBlur } = useDataTableBodyContext();

    const {
        transparent = false,
        clearable = false,
        dashed = false,
        className,
        onCellBlur,
        onCellChange,
        placeholder,
        datalist
    } = params;

    return (
        <Input
            label={label ? { basic: true, content: label } : undefined}
            defaultValue={onCellChange ? undefined : cell}
            value={onCellChange ? cell : undefined}
            placeholder={placeholder}
            onChange={(event, data) => {
                if (onCellChange) {
                    onCellChange(id, field, event, data.value);
                }
                if (onGlobalCellChanged) {
                    onGlobalCellChanged(id, field, event, event.target.value);
                }
            }}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
                if (onCellBlur) {
                    onCellBlur(id, field, event, event.target.value);
                }
                if (onGlobalCellBlur) {
                    onGlobalCellBlur(id, field, event, event.target.value);
                }
            }}
            datalist={datalist}
            className={classNames(
                { [styles.inputTransparent]: transparent },
                { [styles.inputDashed]: dashed },
                className,
                styles.input
            )}
            icon={
                clearable && cell && cell.toString().length > 0
                    ? (
                        <Icon
                            name="remove"
                            link
                            onClick={(event: MouseEvent<HTMLElement>) => {
                                if (onCellChange) {
                                    onCellChange(id, field, event, "");
                                }
                                if (onGlobalCellChanged) {
                                    onGlobalCellChanged(id, field, event, "");
                                }
                            }}
                        />
                    )
                    : undefined
            }
        />
    );
}
