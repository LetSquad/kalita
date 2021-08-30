import classNames from "classnames";
import React, { FocusEvent, KeyboardEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon, Input, Popup } from "semantic-ui-react";
import { DataTableInputParams, InputEditParams } from "../types/edit";
import { useDataTableBodyContext, useDataTableContext, useDataTableEditContext } from "../utils/contexts/hooks";
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

    const { data: tableData } = useDataTableContext();

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

    const [value, setValue] = useState(onCellChange || onGlobalCellChanged ? undefined : cell);
    const [oldValue, setOldValue] = useState(cell);
    const [oldIsValid, setOldIsValid] = useState<boolean>();
    const [isValid, setIsValid] = useState<boolean>();

    const getIsValid = useCallback((
        _oldValue: string | number | boolean | undefined,
        newValue: string | number | boolean | undefined
    ) => {
        let _isValid = true;
        if (validator) {
            _isValid = typeof validator.validate === "boolean"
                ? !validator.validate
                : !validator.validate(tableData, id, field, _oldValue, newValue, row);
        }
        if (isValid !== oldIsValid || oldIsValid === undefined) {
            setOldIsValid(isValid);
        }
        setIsValid(_isValid) ;
    }, [field, id, isValid, oldIsValid, row, tableData, validator]);

    const input = useMemo(() => (
        <div>
            <Input
                ref={inputRef}
                label={label ? { basic: true, content: label } : undefined}
                value={onCellChange || onGlobalCellChanged ? cell : value}
                placeholder={placeholder}
                error={!isValid}
                onChange={(event, data) => {
                    if (onCellChange) {
                        onCellChange(id, field, event, data.value);
                    }
                    if (onGlobalCellChanged) {
                        onGlobalCellChanged(id, field, event, data.value);
                    }
                    if (!onCellChange && !onGlobalCellChanged) {
                        setValue(data.value);
                    }
                    setOldValue(cell);
                }}
                onBlur={(event: FocusEvent<HTMLInputElement>) => {
                    if (!isValid) {
                        event.target.focus();
                    }
                    if (onCellBlur) {
                        onCellBlur(id, field, event, event.target.value);
                    }
                    if (onGlobalCellBlur) {
                        onGlobalCellBlur(id, field, event, event.target.value);
                    }
                    setOldValue(cell);
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
                        setOldValue(cell);
                    }
                    // TODO: Починить
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
                                    setOldValue(cell);
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
        </div>
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
        onCellBlur,
        onGlobalCellBlur,
        onCellKeyEnter,
        onGlobalCellKeyEnter,
        value
    ]);

    const validatorTooltipText = useMemo(() => {
        return validator && validator.tooltip && typeof validator.tooltip.text === "function"
            ? validator.tooltip.text(tableData, id, field, oldValue, cell, row)
            : validator?.tooltip;
    }, [cell, field, id, oldValue, row, tableData, validator]);

    useEffect(() => {
        getIsValid(oldValue, value || cell);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cell, value]);

    // TODO: Починить
    useEffect(() => {
        if (inputRef.current && isValid !== oldIsValid) {
            inputRef.current.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oldIsValid]);

    return validator?.tooltip && validatorTooltipText && !isValid
        ? (
            // TODO: Добавить попап ячейки
            <Popup
                trigger={input}
                position={validator.tooltip.position}
                content={validatorTooltipText}
                className={validator.tooltip.className}
            />
        )
        : input;
}
