import React, { useCallback } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult
} from "react-beautiful-dnd";
import { Accordion, Icon } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import { SidebarMenuElementsTypes } from "../../../models/menu/enums";
import { SidebarMenuGroupType } from "../../../models/menu/types";
import { useAppDispatch } from "../../../store/hooks";
import { addNewElementToGroup, changePortfolioTypeOpenState, updateOrder } from "../../../store/sidebarMenu/sidebarMenuReducer";
import SidebarMenuElement from "./SidebarMenuElement";
import styles from "./styles/SidebarMenuGroup.scss";

interface SidebarMenuGroupProps {
    sidebarMenuGroupType: SidebarMenuGroupType;
}

export default function SidebarMenuGroup({ sidebarMenuGroupType }: SidebarMenuGroupProps) {
    const dispatch = useAppDispatch();

    const changeOpenState = useCallback((type: SidebarMenuElementsTypes) => {
        dispatch(changePortfolioTypeOpenState(type));
    }, [dispatch]);

    const addElement = useCallback((type: SidebarMenuElementsTypes) => {
        dispatch(addNewElementToGroup({
            type,
            id: uuidv4()
        }));
    }, [dispatch]);

    const onDragEnd = useCallback((result: DropResult) => {
        if (result.destination) {
            dispatch(updateOrder({
                oldOrder: {
                    index: result.source.index,
                    type: result.source.droppableId as SidebarMenuElementsTypes
                },
                newOrder: {
                    index: result.destination.index,
                    type: result.destination.droppableId as SidebarMenuElementsTypes
                }
            }));
        }
    }, [dispatch]);

    return (
        <Accordion className={styles.accordion}>
            <Accordion.Title
                className={sidebarMenuGroupType.elements.length > 0
                    ? styles.item
                    : styles.itemEmpty}
            >
                {sidebarMenuGroupType.elements.length > 0
                    ? (
                        <Icon
                            name="dropdown"
                            className={sidebarMenuGroupType.isOpen
                                ? styles.dropdownOpen
                                : styles.dropdown}
                            onClick={() => changeOpenState(sidebarMenuGroupType.type)}
                        />
                    )
                    : null}
                <span>{sidebarMenuGroupType.name}</span>
                <Icon name="plus" className={styles.addIcon} link onClick={() => addElement(sidebarMenuGroupType.type)} />
            </Accordion.Title>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={sidebarMenuGroupType.type}>
                    {(provided) => (
                        <Accordion.Content
                            active={sidebarMenuGroupType.isOpen}
                            className={styles.content}
                        >
                            <div
                                /* eslint-disable-next-line react/jsx-props-no-spreading */
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {sidebarMenuGroupType.elements.map((portfolio, index) => (
                                    <Draggable
                                        key={portfolio.id}
                                        draggableId={portfolio.id}
                                        index={index}
                                        isDragDisabled={sidebarMenuGroupType.elements.length < 2}
                                    >
                                        {(itemProvided) => (
                                            <SidebarMenuElement
                                                itemProvided={itemProvided}
                                                key={portfolio.id}
                                                menuElement={portfolio}
                                                editable
                                            />
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        </Accordion.Content>
                    )}
                </Droppable>
            </DragDropContext>
        </Accordion>
    );
}
