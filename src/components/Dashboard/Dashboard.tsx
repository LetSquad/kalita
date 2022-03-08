import { useEffect, useMemo, useState } from "react";

import nodePath from "path";
import { useSearchParams } from "react-router-dom";
import {
    Icon,
    Menu,
    Segment,
    Sidebar
} from "semantic-ui-react";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentProjectName } from "../../store/sidebarMenu/sidebarMenuReducer";
import partsStyles from "../../styles/parts.scss";
import { WithSaving } from "../utils/WithSaving";
import DashboardContent from "./DashboardContent";
import SidebarMenu from "./SidebarMenu/SidebarMenu";
import styles from "./styles/Dashboard.scss";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();

    const projectName = useAppSelector((state) => state.sidebarMenu.currentProjectName);
    const portfolioName = useAppSelector((state) => state.sidebarMenu.currentPortfolioName);

    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

    const closeSidebarTitle = useMemo(
        () => `${projectName}${portfolioName ? ` :: ${portfolioName}` : ""}`,
        [portfolioName, projectName]
    );

    useEffect(() => {
        const currentProjectPath = searchParams.get("currentProject");
        if (currentProjectPath) {
            dispatch(setCurrentProjectName(currentProjectPath.slice(currentProjectPath.lastIndexOf(nodePath.sep) + 1)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <WithSaving>
            <div className={partsStyles.baseContainer}>
                <Sidebar.Pushable
                    as={Segment}
                    className={styles.pushableSegment}
                >
                    <Sidebar
                        as={Menu}
                        animation="push"
                        icon="labeled"
                        direction="left"
                        vertical
                        visible
                        className={sidebarVisible ? styles.sidebarContainerOpen : styles.sidebarContainerClose}
                    >
                        {
                            sidebarVisible
                                ? (
                                    <SidebarMenu
                                        projectName={projectName}
                                        onSidebarClose={() => setSidebarVisible(false)}
                                    />
                                )
                                : (
                                    <div
                                        aria-hidden
                                        onClick={() => setSidebarVisible(true)}
                                        className={styles.sidebarClose}
                                    >
                                        <div className={styles.sidebarCloseTitleContainer}>
                                            <span className={styles.sidebarCloseTitle}>{closeSidebarTitle}</span>
                                        </div>
                                        <Icon
                                            className={styles.sidebarCloseIcon}
                                            name="angle double right"
                                            link
                                        />
                                    </div>
                                )
                        }
                    </Sidebar>
                    <Sidebar.Pusher className={sidebarVisible ? styles.pusherOpen : styles.pusherClose}>
                        <DashboardContent />
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        </WithSaving>
    );
}
