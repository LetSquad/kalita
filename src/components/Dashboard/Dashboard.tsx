import fs from "fs-extra";
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Menu, Segment, Sidebar } from "semantic-ui-react";
import { saveProjectFileName } from "../../models/constants";
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

    const setStartState = useCallback((savedData: SidebarMenuGroupType[]) => {
        dispatch(setMenuGroups(savedData));
    }, [dispatch]);

    useEffect(() => {
        const folderPath = decodeURI(history.location.search.replace("?currentProject=", ""));
        const filePath = `${folderPath}/${saveProjectFileName}`;

        if (fs.existsSync(filePath)) {
            try {
                const firstMenuGroupsState: SidebarMenuGroupType[] = fs.readJSONSync(filePath);
                setStartState(firstMenuGroupsState);
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
        const filePath = `${folderPath}/${saveProjectFileName}`;
        fs.writeJson(filePath, menuGroups)
            .catch(() => {
                addToast(`Ошибка сохранения проекта "${folderPath}"`, { appearance: "error" });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuGroups]);

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
                    className={styles.sidebar}
                >
                    <SidebarMenu />
                </Sidebar>
                <Sidebar.Pusher className={styles.pusher}>
                    <DashboardContent />
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    );
}
