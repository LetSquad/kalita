import fs from "fs-extra";
import nodePath from "path";
import React, {
    useCallback, useEffect, useMemo, useState
} from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
    Icon, Menu, Segment, Sidebar
} from "semantic-ui-react";
import { currentSaveFileVersion, saveProjectFileName } from "../../models/constants";
import { SidebarMenuGroupType } from "../../models/menu/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentProjectName, setMenuGroups } from "../../store/sidebarMenu/sidebarMenuReducer";
import partsStyles from "../../styles/parts.scss";
import DashboardContent from "./DashboardContent";
import SidebarMenu from "./SidebarMenu/SidebarMenu";
import styles from "./styles/Dashboard.scss";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { addToast } = useToasts();

    const menuGroups = useAppSelector((state) => state.sidebarMenu.menuGroups);
    const projectName = useAppSelector((state) => state.sidebarMenu.currentProjectName);
    const portfolioName = useAppSelector((state) => state.sidebarMenu.currentPortfolioName);

    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

    const setStartState = useCallback((savedData: SidebarMenuGroupType[]) => {
        dispatch(setMenuGroups(savedData));
    }, [dispatch]);

    const closeSidebarTitle = useMemo(() => `${projectName}${portfolioName ? ` :: ${portfolioName}` : ""}`, [portfolioName, projectName]);

    useEffect(() => {
        const folderPath = decodeURI(history.location.search.replace("?currentProject=", ""));
        const filePath = `${folderPath}/${saveProjectFileName}`;

        if (fs.existsSync(filePath)) {
            try {
                const saveFile: { version: string, content: SidebarMenuGroupType[] } = fs.readJSONSync(filePath);
                setStartState(saveFile.content);
            } catch {
                addToast(`Ошибка открытия проекта "${folderPath}"`, { appearance: "error" });
                history.push("/");
            }
        } else {
            addToast(`Проект "${folderPath}" отсутствует или сломан`, { appearance: "error" });
            history.push("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const folderPath = decodeURI(history.location.search.replace("?currentProject=", ""));
        if (folderPath !== "") {
            const filePath = `${folderPath}/${saveProjectFileName}`;
            fs.writeJson(filePath, { version: currentSaveFileVersion, content: menuGroups })
                .catch(() => {
                    addToast(`Ошибка сохранения проекта "${folderPath}"`, { appearance: "error" });
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuGroups]);

    useEffect(() => {
        const path = decodeURI(history.location.search);
        dispatch(setCurrentProjectName(path.slice(path.lastIndexOf(nodePath.sep) + 1)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history.location.search]);

    return (
        <div className={partsStyles.baseContainer}>
            <Sidebar.Pushable as={Segment} className={styles.pushableSegment}>
                <Sidebar
                    as={Menu}
                    animation="push"
                    icon="labeled"
                    direction="left"
                    vertical
                    visible
                    className={sidebarVisible ? styles.sidebarOpen : styles.sidebarClose}
                >
                    {
                        sidebarVisible
                            ? <SidebarMenu projectName={projectName} onSidebarClose={() => setSidebarVisible(false)} />
                            : (
                                <>
                                    <div className={styles.sidebarCloseTitleContainer}>
                                        <span className={styles.sidebarCloseTitle}>{closeSidebarTitle}</span>
                                    </div>
                                    <Icon
                                        className={styles.sidebarCloseIcon} name="angle double right" link
                                        onClick={() => setSidebarVisible(true)}
                                    />
                                </>
                            )
                    }
                </Sidebar>
                <Sidebar.Pusher className={sidebarVisible ? styles.pusherOpen : styles.pusherClose}>
                    <DashboardContent />
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    );
}
