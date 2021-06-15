import React, { useCallback } from "react";
import { BrokeragePortfolioTypes, SidebarMenuElementsTypes } from "../../../../custom_typings/enums";
import { BrokerAccountMenuElement, ModelPortfolioMenuElement } from "../../../../custom_typings/types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setActiveId } from "../../../store/sidebarMenuReducer";
import { setCurrentPortfolio } from "../../../store/table/tableReducer";
import styles from "./styles/SidebarMenuElement.scss";

interface Props {
    menuElement: ModelPortfolioMenuElement | BrokerAccountMenuElement;
}

export default function SidebarMenuElement(props: Props) {
    const dispatch = useAppDispatch();
    const activeFile = useAppSelector((state) => state.sidebarMenu.activeMenuElementId);
    const active = activeFile?.[1] === props.menuElement.id;

    const changeActiveId = useCallback((type: SidebarMenuElementsTypes, id: string) => {
        dispatch(setActiveId([type, id]));
    }, [dispatch]);

    const setPortfolio = useCallback(() => {
        if (props.menuElement.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
            dispatch(setCurrentPortfolio([BrokeragePortfolioTypes.MODEL_PORTFOLIO, props.menuElement.data]));
        } else {
            dispatch(setCurrentPortfolio([BrokeragePortfolioTypes.BROKER_ACCOUNT, props.menuElement.data]));
        }
    }, [dispatch, props.menuElement]);

    return (
        <div className={active ? styles.activeItem : undefined}>
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
        </div>
    );
}
