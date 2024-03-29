import { useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { Icon } from "semantic-ui-react";

import { loadMoexQuotesByTickers } from "../../../apis/moexApi";
import { SidebarMenuElementsTypes } from "../../../models/menu/enums";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { allTickerSelector } from "../../../store/portfolios/selectors";
import { setDefault } from "../../../store/sidebarMenu/sidebarMenuReducer";
import SidebarMenuElement from "./SidebarMenuElement";
import SidebarMenuGroup from "./SidebarMenuGroup";
import styles from "./styles/SidebarMenu.scss";

interface SidebarMenuProps {
    projectName: string | undefined;
    onSidebarClose: () => void;
}

export default function SidebarMenu({ onSidebarClose, projectName }: SidebarMenuProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const modelPortfolios = useAppSelector((state) => state.sidebarMenu.modelPortfolios);
    const brokerAccounts = useAppSelector((state) => state.sidebarMenu.brokerAccounts);
    const allTickers = useAppSelector(allTickerSelector);
    const isSavingInProgress = useAppSelector((state) => state.portfolios.isSavingInProgress);

    const closeProject = useCallback(() => {
        dispatch(setDefault());
        navigate("/");
    }, [dispatch, navigate]);

    const updatePortfolios = useCallback(() => {
        dispatch(loadMoexQuotesByTickers({ tickers: allTickers, isGlobalUpdate: true }));
    }, [allTickers, dispatch]);

    return (
        <div className={styles.sidebar}>
            <div className={styles.titleContainer}>
                <span className={styles.title}>{projectName}</span>
                <div className={styles.titleIconContainer}>
                    <Icon
                        className={styles.titleRefreshIcon}
                        name="sync alternate"
                        link
                        onClick={updatePortfolios}
                    />
                    <Icon
                        name="log out"
                        link
                        disabled={isSavingInProgress}
                        onClick={closeProject}
                    />
                </div>
            </div>
            <div className={styles.separator} />
            <div className={styles.menuGroupContainer}>
                <SidebarMenuGroup
                    key={modelPortfolios.type}
                    sidebarMenuGroupType={modelPortfolios}
                />
                <SidebarMenuGroup
                    key={brokerAccounts.type}
                    sidebarMenuGroupType={brokerAccounts}
                />
                <SidebarMenuElement
                    menuElement={{
                        id: SidebarMenuElementsTypes.ANALYTICS,
                        name: "Аналитика",
                        type: SidebarMenuElementsTypes.ANALYTICS
                    }}
                />
            </div>
            <div className={styles.iconContainer}>
                <Icon
                    className={styles.icon}
                    name="angle double left"
                    onClick={onSidebarClose}
                    link
                />
            </div>
        </div>
    );
}
