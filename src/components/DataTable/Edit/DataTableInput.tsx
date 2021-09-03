import classNames from "classnames";
import React, { FocusEvent, KeyboardEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon, Input, Popup, Ref } from "semantic-ui-react";
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

    const inputRef = useRef<HTMLInputElement>(null);

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
    const [isFocus, setIsFocus] = useState(false);
    const [isHover, setIsHover] = useState(false);

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
        return _isValid;
    }, [field, id, row, tableData, validator]);

    const isValid = useMemo(() => getIsValid(oldValue, value || cell), [cell, getIsValid, oldValue, value]);

    const input = useMemo(() => (
        <div>
            <Ref innerRef={inputRef}>
                <Input
                    label={label ? { basic: true, content: label } : undefined}
                    labelPosition={label ? "right" : undefined}
                    value={onCellChange || onGlobalCellChanged ? cell : value}
                    placeholder={placeholder}
                    error={!isValid}
                    onFocus={() => setIsFocus(true)}
                    onMouseOver={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onChange={(event, data) => {
                        if (onCellChange) {
                            onCellChange(id, field, event, data.value);
                            setOldValue(cell);
                        }
                        if (onGlobalCellChanged) {
                            onGlobalCellChanged(id, field, event, data.value);
                            setOldValue(cell);
                        }
                        if (!onCellChange && !onGlobalCellChanged) {
                            setValue(data.value);
                            setOldValue(value);
                        }
                    }}
                    onBlur={(event: FocusEvent<HTMLInputElement>) => {
                        if (!getIsValid(oldValue, event.target.value)) {
                            event.target.focus();
                        } else {
                            setIsFocus(false);
                            if (onCellBlur) {
                                onCellBlur(id, field, event, event.target.value);
                                setOldValue(event.target.value);
                            }
                            if (onGlobalCellBlur) {
                                onGlobalCellBlur(id, field, event, event.target.value);
                                setOldValue(event.target.value);
                            }
                        }
                    }}
                    onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === "Escape") {
                            (event.target as HTMLInputElement).blur();
                        }
                    }}
                    onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
                        if (!getIsValid(oldValue, (event.target as HTMLInputElement).value)) {
                            (event.target as HTMLInputElement).focus();
                        } else if (event.key === "Enter") {
                            if (onCellKeyEnter) {
                                onCellKeyEnter(id, field, event, (event.target as HTMLInputElement).value);
                                (event.target as HTMLInputElement).blur();
                            }
                            if (onGlobalCellKeyEnter) {
                                onGlobalCellKeyEnter(id, field, event, (event.target as HTMLInputElement).value);
                                (event.target as HTMLInputElement).blur();
                            }
                        }
                    }}
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
            </Ref>
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
        value,
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
        oldValue,
        onCellBlur,
        onGlobalCellBlur,
        onCellKeyEnter,
        onGlobalCellKeyEnter
    ]);

    const validatorTooltipText = useMemo(() => {
        return validator && validator.tooltip && typeof validator.tooltip.text === "function"
            ? validator.tooltip.text(tableData, id, field, oldValue, value || cell, row)
            : validator?.tooltip;
    }, [cell, field, id, oldValue, row, tableData, validator, value]);

    useEffect(() => {
        if (isFocus && document.activeElement != inputRef.current?.children[0]) {
            inputRef.current?.focus();
        }
    }, [isFocus]);

    return useMemo(() => (
        <>
            <Popup
                open={isFocus ? !isValid : isHover && !isValid}
                context={inputRef}
                position={validator?.tooltip
                    ? validator.tooltip.position
                    : undefined}
                content={validatorTooltipText}
                className={validator?.tooltip
                    ? validator.tooltip.className
                    : undefined}
            />
            {input}
        </>
    ), [input, isFocus, isHover, isValid, validator?.tooltip, validatorTooltipText]);
}
