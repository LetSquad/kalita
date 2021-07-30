import React, {
    useCallback, useEffect, useMemo, useRef, useState
} from "react";
import { Icon, Input } from "semantic-ui-react";
import { SidebarMenuElementsTypes } from "../../../models/menu/enums";
import { BrokerAccountMenuElement, ModelPortfolioMenuElement } from "../../../models/menu/types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { currentPortfolioSelector } from "../../../store/portfolios/selectors";
import {
    deleteElementFromGroup,
    renameElementInGroup,
    setActiveId, setCurrentPortfolioName
} from "../../../store/sidebarMenu/sidebarMenuReducer";
import styles from "./styles/SidebarMenuElement.scss";

interface Props {
    menuElement: ModelPortfolioMenuElement | BrokerAccountMenuElement;
}

export default function SidebarMenuElement(props: Props) {
    const dispatch = useAppDispatch();

    const inputRef = useRef<Input>(null);

    const activeFile = useAppSelector((state) => state.sidebarMenu.activeMenuElementId);
    const currentPortfolio = useAppSelector(currentPortfolioSelector);

    const active = activeFile?.id === props.menuElement.id;

    const [currentEditValue, setCurrentEditValue] = useState<string>();

    const renameElement = useCallback((type: SidebarMenuElementsTypes, id: string, newName: string) => {
        dispatch(renameElementInGroup({
            type,
            id,
            newName
        }));
        dispatch(setCurrentPortfolioName(newName));
        setCurrentEditValue(undefined);
    }, [dispatch]);

    const deleteElement = useCallback((type: SidebarMenuElementsTypes, id: string) => {
        if (currentPortfolio?.id === id) {
            dispatch(setCurrentPortfolioName(undefined));
        }
        dispatch(deleteElementFromGroup({
            type,
            id
        }));
    }, [currentPortfolio?.id, dispatch]);

    const setPortfolio = useCallback((type: SidebarMenuElementsTypes, id: string) => {
        dispatch(setActiveId({
            type,
            id
        }));
        dispatch(setCurrentPortfolioName(props.menuElement.name));
    }, [dispatch, props.menuElement]);

    const elementRenameInput = useCallback((_currentEditValue) => (
        <Input
            value={_currentEditValue} fluid className={styles.renameInput} ref={inputRef} placeholder="Введите имя"
            onChange={(event, data) => setCurrentEditValue(data.value)}
            onKeyPress={(event: KeyboardEvent) =>
                (event.key === "Enter"
                    ? renameElement(props.menuElement.type, props.menuElement.id, (event.target as HTMLInputElement).value)
                    : undefined)}
            onBlur={
                (event: FocusEvent) =>
                    renameElement(props.menuElement.type, props.menuElement.id, (event.target as HTMLInputElement).value)
            }
        />
    ), [props.menuElement.id, props.menuElement.type, renameElement]);

    const elementNameBlock = useMemo(() => (
        <div
            aria-hidden className={styles.item}
            onClick={() => {
                setPortfolio(props.menuElement.type, props.menuElement.id);
            }}
        >
            <div className={styles.name}>
                {props.menuElement.name}
            </div>
        </div>
    ), [props.menuElement.id, props.menuElement.name, props.menuElement.type, setPortfolio]);

    const elementTitle = useMemo(() => (
        currentEditValue !== undefined
            ? elementRenameInput(currentEditValue)
            : elementNameBlock
    ), [currentEditValue, elementNameBlock, elementRenameInput]);

    useEffect(() => {
        if (currentEditValue) {
            inputRef.current?.focus();
        }
    }, [currentEditValue]);

    return (
        <div className={active
            ? styles.activeItemContainer
            : styles.itemContainer}
        >
            {elementTitle}
            <div className={styles.iconsContainer}>
                <Icon
                    name="edit outline" link={currentEditValue === undefined} className={styles.renameIcon}
                    disabled={currentEditValue !== undefined}
                    onClick={() => setCurrentEditValue(props.menuElement.name)}
                />
                <Icon
                    name="trash alternate outline" link className={styles.removeIcon}
                    onClick={() => deleteElement(props.menuElement.type, props.menuElement.id)}
                />
            </div>
        </div>
    );
}
