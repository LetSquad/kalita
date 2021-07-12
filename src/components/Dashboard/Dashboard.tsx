import fs from "fs-extra";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
    Icon, Menu, Segment, Sidebar
} from "semantic-ui-react";
import { currentSaveFileVersion, saveProjectFileName } from "../../models/constants";
import { SidebarMenuGroupType } from "../../models/menu/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setMenuGroups } from "../../store/sidebarMenu/sidebarMenuReducer";
import partsStyles from "../../styles/parts.scss";
import DashboardContent from "./DashboardContent";
import SidebarMenu from "./SidebarMenu/SidebarMenu";
import styles from "./styles/Dashboard.scss";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { addToast } = useToasts();

    const menuGroups = useAppSelector((state) => state.sidebarMenu.menuGroups);

    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

    const setStartState = useCallback((savedData: SidebarMenuGroupType[]) => {
        dispatch(setMenuGroups(savedData));
    }, [dispatch]);

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

    return (
        <div className={partsStyles.baseContainer}>
            <Sidebar.Pushable as={Segment} className={styles.pushableSegment}>
                {
                    sidebarVisible
                        ? (
                            <Sidebar
                                as={Menu}
                                animation="push"
                                icon="labeled"
                                direction="left"
                                vertical
                                visible
                                className={sidebarVisible ? styles.sidebarOpen : styles.sidebarClose}
                            >
                                <SidebarMenu onSidebarClose={() => setSidebarVisible(false)} />
                            </Sidebar>
                        )
                        : (
                            <div className={styles.sidebarClose}>
                                <Icon
                                    className={styles.sidebarCloseIcon} name="angle double right" link
                                    onClick={() => setSidebarVisible(true)}
                                />
                            </div>
                        )
                }
                <Sidebar.Pusher className={sidebarVisible ? styles.pusherOpen : styles.pusherClose}>
                    <DashboardContent />
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    );
}
