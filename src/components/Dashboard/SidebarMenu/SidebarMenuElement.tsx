import React, { useCallback, useMemo, useState } from "react";
import { Icon, Input } from "semantic-ui-react";
import { SidebarMenuElementsTypes } from "../../../model/menu/enums";
import { BrokerAccountMenuElement, ModelPortfolioMenuElement } from "../../../model/menu/types";
import { BrokeragePortfolioTypes } from "../../../model/portfolios/enums";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    deleteElementFromGroup,
    renameElementInGroup,
    setActiveId
} from "../../../store/sidebarMenu/sidebarMenuReducer";
import { setCurrentPortfolio } from "../../../store/table/tableReducer";
import styles from "./styles/SidebarMenuElement.scss";

interface Props {
    menuElement: ModelPortfolioMenuElement | BrokerAccountMenuElement;
}

export default function SidebarMenuElement(props: Props) {
    const dispatch = useAppDispatch();
    const activeFile = useAppSelector((state) => state.sidebarMenu.activeMenuElementId);
    const active = activeFile?.id === props.menuElement.id;

    const [currentEditValue, setCurrentEditValue] = useState<string>();

    const changeActiveId = useCallback((type: SidebarMenuElementsTypes, id: string) => {
        dispatch(setActiveId({
            type,
            id
        }));
    }, [dispatch]);

    const renameElement = useCallback((type: SidebarMenuElementsTypes, id: string, newName: string) => {
        dispatch(renameElementInGroup({
            type,
            id,
            newName
        }));
        setCurrentEditValue(undefined);
    }, [dispatch]);

    const deleteElement = useCallback((type: SidebarMenuElementsTypes, id: string) => {
        dispatch(deleteElementFromGroup({
            type,
            id
        }));
    }, [dispatch]);

    const setPortfolio = useCallback(() => {
        if (props.menuElement.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
            dispatch(setCurrentPortfolio({
                type: BrokeragePortfolioTypes.MODEL_PORTFOLIO,
                positions: props.menuElement.data.positions,
                totalTargetAmount: props.menuElement.data.totalTargetAmount
            }));
        } else {
            dispatch(setCurrentPortfolio({
                type: BrokeragePortfolioTypes.BROKER_ACCOUNT,
                positions: props.menuElement.data
            }));
        }
    }, [dispatch, props.menuElement]);

    const elementRenameInput = useCallback((_currentEditValue) => (
        <Input
            value={_currentEditValue} fluid className={styles.renameInput}
            placeholder="Введите имя"
            onChange={(event, data) => setCurrentEditValue(data.value)}
            icon={(
                <Icon
                    name="save" link={_currentEditValue !== ""} disabled={_currentEditValue === ""}
                    onClick={() => renameElement(props.menuElement.type, props.menuElement.id, _currentEditValue)}
                />
            )}
        />
    ), [props.menuElement.id, props.menuElement.type, renameElement]);

    const elementNameBlock = useMemo(() => (
        <div
            aria-hidden className={styles.item}
            onClick={() => {
                changeActiveId(props.menuElement.type, props.menuElement.id);
                setPortfolio();
            }}
        >
            <div className={styles.name}>
                {props.menuElement.name}
            </div>
        </div>
    ), [changeActiveId, props.menuElement.id, props.menuElement.name, props.menuElement.type, setPortfolio]);

    const elementTitle = useMemo(() => (
        currentEditValue
            ? elementRenameInput(currentEditValue)
            : elementNameBlock
    ), [currentEditValue, elementNameBlock, elementRenameInput]);

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
