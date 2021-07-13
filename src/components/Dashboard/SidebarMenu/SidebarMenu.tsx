import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setCurrentProjectName, setMenuGroups } from "../../../store/sidebarMenu/sidebarMenuReducer";
import { baseSidebarMenuGroups } from "../../../store/sidebarMenu/sidebarMenuReducerHelper";
import { resetCurrentPortfolio } from "../../../store/table/tableReducer";
import SidebarMenuGroup from "./SidebarMenuGroup";
import styles from "./styles/SidebarMenu.scss";

interface SidebarMenuProps {
    projectName: string | undefined;
    onSidebarClose: () => void;
}

export default function SidebarMenu({ onSidebarClose, projectName }: SidebarMenuProps) {
    const dispatch = useAppDispatch();
    const history = useHistory();

    const portfoliosTypes = useAppSelector((state) => state.sidebarMenu.menuGroups);

    const setDefaultState = useCallback(() => {
        dispatch(resetCurrentPortfolio());
        dispatch(setCurrentProjectName(undefined));
        dispatch(setMenuGroups(baseSidebarMenuGroups));
    }, [dispatch]);

    const closeProject = useCallback(() => {
        setDefaultState();
        history.push("/");
    }, [history, setDefaultState]);

    return (
        <>
            <div className={styles.titleContainer}>
                <span className={styles.title}>{projectName}</span>
                <Icon name="log out" link onClick={closeProject} />
            </div>
            <div className={styles.separator} />
            <div className={styles.menuGroupContainer}>
                {portfoliosTypes.map((portfolioType) => (
                    <SidebarMenuGroup key={portfolioType.type} sidebarMenuGroupType={portfolioType} />
                ))}
            </div>
            <div className={styles.iconContainer}>
                <Icon className={styles.icon} name="angle double left" onClick={onSidebarClose} link />
            </div>
        </>
    );
}
