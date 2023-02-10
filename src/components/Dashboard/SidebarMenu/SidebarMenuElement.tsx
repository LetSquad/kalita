import {
    FocusEvent,
    KeyboardEvent,
    MouseEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import { DraggableProvided } from "react-beautiful-dnd";
import { Icon, Input } from "semantic-ui-react";

import { SidebarMenuElementsTypes } from "../../../models/menu/enums";
import { AnalyticsMenuElement, BrokerAccountMenuElement, ModelPortfolioMenuElement } from "../../../models/menu/types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    deleteElementFromGroup,
    renameElementInGroup,
    setActiveId,
    setCurrentMenuElementName
} from "../../../store/sidebarMenu/sidebarMenuReducer";
import styles from "./styles/SidebarMenuElement.scss";

interface SidebarMenuElementProps {
    itemProvided?: DraggableProvided
    menuElement: ModelPortfolioMenuElement | BrokerAccountMenuElement | AnalyticsMenuElement;
    editable?: boolean
    deletable?: boolean
}

export default function SidebarMenuElement({
    itemProvided,
    menuElement,
    editable = false,
    deletable = false
}: SidebarMenuElementProps) {
    const dispatch = useAppDispatch();

    const inputRef = useRef<Input>(null);

    const activeFile = useAppSelector((state) => state.sidebarMenu.activeMenuElementId);

    const active = activeFile?.id === menuElement.id;

    const [currentEditValue, setCurrentEditValue] = useState<string>();

    const renameElement = useCallback((type: SidebarMenuElementsTypes, id: string, newName: string) => {
        dispatch(renameElementInGroup({
            type,
            id,
            newName
        }));
        dispatch(setCurrentMenuElementName(newName));
        setCurrentEditValue(undefined);
    }, [dispatch]);

    const deleteElement = useCallback((type: SidebarMenuElementsTypes, id: string) => {
        if (active) {
            dispatch(setCurrentMenuElementName(undefined));
        }
        dispatch(deleteElementFromGroup({
            type,
            id
        }));
    }, [active, dispatch]);

    const setActiveMenuElementId = useCallback((type: SidebarMenuElementsTypes, id: string) => {
        if (!active) {
            dispatch(setActiveId({
                type,
                id
            }));
            dispatch(setCurrentMenuElementName(menuElement.name));
        }
    }, [dispatch, menuElement.name, active]);

    const elementRenameInput = useCallback((_currentEditValue: string) => (
        <Input
            value={_currentEditValue}
            fluid
            className={styles.renameInput}
            ref={inputRef}
            placeholder="Введите имя"
            onFocus={(event: MouseEvent<HTMLInputElement>) => (event.target as HTMLInputElement).select()}
            onChange={(event, data) => setCurrentEditValue(data.value)}
            onKeyPress={({ key, target }: KeyboardEvent<HTMLInputElement>) =>
                (key === "Enter" && renameElement(menuElement.type, menuElement.id, (target as HTMLInputElement).value))}
            onBlur={({ target }: FocusEvent<HTMLInputElement>) => renameElement(menuElement.type, menuElement.id, target.value)}
        />
    ), [menuElement.id, menuElement.type, renameElement]);

    const elementNameBlock = useMemo(() => (
        <div
            aria-hidden
            className={styles.item}
            onClick={() => {
                setActiveMenuElementId(menuElement.type, menuElement.id);
            }}
        >
            <div className={styles.name}>
                {menuElement.name}
            </div>
        </div>
    ), [menuElement.id, menuElement.name, menuElement.type, setActiveMenuElementId]);

    const elementTitle = useMemo(() => (
        currentEditValue === undefined
            ? elementNameBlock
            : elementRenameInput(currentEditValue)
    ), [currentEditValue, elementNameBlock, elementRenameInput]);

    const editButton = useMemo(() => {
        if (!editable) return null;
        return (
            <Icon
                name="edit outline"
                className={styles.renameIcon}
                disabled={currentEditValue !== undefined}
                onClick={() => setCurrentEditValue(menuElement.name)}
                link={currentEditValue === undefined}
            />
        );
    }, [editable, currentEditValue, setCurrentEditValue, menuElement.name]);

    const deleteButton = useMemo(() => {
        if (!deletable) return null;
        return (
            <Icon
                name="trash alternate outline"
                className={styles.removeIcon}
                onClick={() => deleteElement(menuElement.type, menuElement.id)}
                link
            />
        );
    }, [deletable, deleteElement, menuElement.type, menuElement.id]);

    const elementContent = useMemo(() => (
        <>
            {elementTitle}
            {(editButton || deleteButton) && (
                <div className={styles.iconsContainer}>
                    {editButton}
                    {deleteButton}
                </div>
            )}
        </>
    ), [elementTitle, editButton, deleteButton]);

    const elementClassName = useMemo(() => (
        active ? styles.activeItemContainer : styles.itemContainer
    ), [active]);

    useEffect(() => {
        if (currentEditValue) {
            inputRef.current?.focus();
        }
    }, [currentEditValue]);

    if (itemProvided) {
        return (
            <div
                className={elementClassName}
                ref={itemProvided.innerRef}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...itemProvided.draggableProps}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...itemProvided.dragHandleProps}
            >
                {elementContent}
            </div>
        );
    }

    return (
        <div className={elementClassName}>
            {elementContent}
        </div>
    );
}
