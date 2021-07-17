import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setCurrentPortfolioName, setCurrentProjectName, setMenuGroups } from "../../../store/sidebarMenu/sidebarMenuReducer";
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

    const modelPortfolios = useAppSelector((state) => state.sidebarMenu.modelPortfolios);
    const brokerAccounts = useAppSelector((state) => state.sidebarMenu.brokerAccounts);

    const setDefaultState = useCallback(() => {
        dispatch(resetCurrentPortfolio());
        dispatch(setCurrentProjectName(undefined));
        dispatch(setCurrentPortfolioName(undefined));
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
                <SidebarMenuGroup key={modelPortfolios.type} sidebarMenuGroupType={modelPortfolios} />
                <SidebarMenuGroup key={brokerAccounts.type} sidebarMenuGroupType={brokerAccounts} />
            </div>
            <div className={styles.iconContainer}>
                <Icon className={styles.icon} name="angle double left" onClick={onSidebarClose} link />
            </div>
        </>
    );
}
