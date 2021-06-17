import React, { useCallback } from "react";
import { Accordion, Icon } from "semantic-ui-react";
import { SidebarMenuElementsTypes } from "../../../../custom_typings/menu/enums";
import { SidebarMenuGroupType } from "../../../../custom_typings/menu/types";
import { useAppDispatch } from "../../../store/hooks";
import { addNewElementToGroup, changePortfolioTypeOpenState } from "../../../store/sidebarMenu/sidebarMenuReducer";
import SidebarMenuElement from "./SidebarMenuElement";
import styles from "./styles/SidebarMenuGroup.scss";

interface Props {
    sidebarMenuGroupType: SidebarMenuGroupType
}

export default function SidebarMenuGroup(props: Props) {
    const dispatch = useAppDispatch();

    const changeOpenState = useCallback((type: SidebarMenuElementsTypes) => {
        dispatch(changePortfolioTypeOpenState(type));
    }, [dispatch]);

    const addElement = useCallback((type: SidebarMenuElementsTypes) => {
        dispatch(addNewElementToGroup(type));
    }, [dispatch]);

    return (
        <Accordion className={styles.accordion}>
            <Accordion.Title
                className={props.sidebarMenuGroupType.elements.length > 0
                    ? styles.item
                    : styles.itemEmpty}
            >
                {props.sidebarMenuGroupType.elements.length > 0
                    ? (
                        <Icon
                            name="dropdown"
                            className={props.sidebarMenuGroupType.isOpen
                                ? styles.dropdownOpen
                                : styles.dropdown}
                            onClick={() => changeOpenState(props.sidebarMenuGroupType.type)}
                        />
                    )
                    : null}
                <span>{props.sidebarMenuGroupType.name}</span>
                <Icon name="plus" className={styles.addIcon} link onClick={() => addElement(props.sidebarMenuGroupType.type)} />
            </Accordion.Title>
            <Accordion.Content active={props.sidebarMenuGroupType.isOpen} className={styles.content}>
                {props.sidebarMenuGroupType.elements.map((portfolio) => (
                    <SidebarMenuElement key={portfolio.id} menuElement={portfolio} />
                ))}
            </Accordion.Content>
        </Accordion>
    );
}
