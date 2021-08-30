import classNames from "classnames";
import React, { FocusEvent, KeyboardEvent, MouseEvent, useCallback, useEffect, useMemo, useRef } from "react";
import { Icon, Input, Popup } from "semantic-ui-react";
import { DataTableInputParams, InputEditParams } from "../types/edit";
import { useDataTableBodyContext, useDataTableEditContext } from "../utils/contexts/hooks";
import styles from "./styles/DataTableInput.scss";

const defaultParams: InputEditParams = {
    transparent: false,
    clearable: false,
    dashed: false
};

export default function DataTableInput({ params = defaultParams, label }: DataTableInputParams) {
    const { cell, id, column: { field, validator }, row } = useDataTableEditContext();
    const {
        onCellChanged: onGlobalCellChanged,
        onCellBlur: onGlobalCellBlur,
        onCellKeyEnter: onGlobalCellKeyEnter
    } = useDataTableBodyContext();

    const inputRef = useRef<Input>(null);

    const {
        transparent = false,
        clearable = false,
        dashed = false,
        className,
        onCellBlur,
        onCellChange,
        onCellKeyEnter,
        placeholder,
        datalist
    } = params;

    const getIsValid = useCallback((_cell: string | number | boolean | undefined) => {
        if (validator) {
            if (typeof validator.validate === "boolean") {
                return validator.validate;
            }
            return validator.validate(id, field, _cell, row);
        }
        return true;
    }, [field, id, row, validator]);

    const isValid = useMemo(() => getIsValid(cell), [cell, getIsValid]);

    const input = useMemo(() => (
        <>
            <Input
                ref={inputRef}
                label={label ? { basic: true, content: label } : undefined}
                defaultValue={onCellChange || onGlobalCellChanged ? undefined : cell}
                value={onCellChange || onGlobalCellChanged ? cell : undefined}
                placeholder={placeholder}
                error={!isValid}
                onChange={(event, data) => {
                    if (onCellChange) {
                        onCellChange(id, field, event, data.value);
                    }
                    if (onGlobalCellChanged) {
                        onGlobalCellChanged(id, field, event, event.target.value);
                    }
                }}
                onBlur={(event: FocusEvent<HTMLInputElement>) => {
                    if (!isValid || !getIsValid(event.target.value)) {
                        event.preventDefault();
                    }
                    if (onCellBlur) {
                        onCellBlur(id, field, event, event.target.value);
                    }
                    if (onGlobalCellBlur) {
                        onGlobalCellBlur(id, field, event, event.target.value);
                    }
                }}
                onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === "Enter") {
                        if (onCellKeyEnter) {
                            onCellKeyEnter(id, field, event, (event.target as HTMLInputElement).value);
                            (event.target as HTMLInputElement).blur();
                        }
                        if (onGlobalCellKeyEnter) {
                            onGlobalCellKeyEnter(id, field, event, (event.target as HTMLInputElement).value);
                            (event.target as HTMLInputElement).blur();
                        }
                    }
                    if (event.key === "Escape") {
                        (event.target as HTMLInputElement).blur();
                    }
                }
                }
                list={datalist && datalist.length > 0 ? `${id}-${field}-hints` : undefined}
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
                                className={styles.inputRemoveIcon}
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
            {
                datalist && datalist.length > 0 && (
                    <datalist id={`${id}-${field}-hints`}>
                        {
                            datalist.map((option) => (
                                <option value={option.value} key={option.value}>
                                    {option.text || option.value}
                                </option>
                            ))
                        }
                    </datalist>
                )
            }
        </>
    ), [
        label,
        onCellChange,
        onGlobalCellChanged,
        cell,
        placeholder,
        isValid,
        datalist,
        id,
        field,
        transparent,
        dashed,
        className,
        clearable,
        getIsValid,
        onCellBlur,
        onGlobalCellBlur,
        onCellKeyEnter,
        onGlobalCellKeyEnter
    ]);

    const validatorTooltipText = useMemo(() => {
        return validator && validator.tooltip && typeof validator.tooltip.text === "function"
            ? validator.tooltip.text(id, field, cell, row)
            : validator?.tooltip;
    }, [cell, field, id, row, validator]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [isValid]);

    return validator?.tooltip && validatorTooltipText && !isValid
        ? (
            <Popup
                trigger={input}
                position={validator.tooltip.position}
                content={validatorTooltipText}
                className={validator.tooltip.className}
            />
        )
        : input;
}
