import fs from "fs-extra";
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Menu, Segment, Sidebar } from "semantic-ui-react";
import { saveProjectFileName } from "../../model/constants";
import { SidebarMenuGroupType } from "../../model/menu/types";
import { useAppDispatch } from "../../store/hooks";
import { setMenuGroups } from "../../store/sidebarMenu/sidebarMenuReducer";
import partsStyles from "../../styles/parts.scss";
import DashboardContent from "./DashboardContent";
import SidebarMenu from "./SidebarMenu/SidebarMenu";
import styles from "./styles/Dashboard.scss";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { addToast } = useToasts();

    const setStartState = useCallback((savedData: SidebarMenuGroupType[]) => {
        dispatch(setMenuGroups(savedData));
    }, [dispatch]);

    useEffect(() => {
        const folderPath = decodeURI(history.location.search.replace("?currentProject=", ""));
        const filePath = `${folderPath}/${saveProjectFileName}`;

        if (fs.existsSync(filePath)) {
            try {
                const menuGroups: SidebarMenuGroupType[] = fs.readJSONSync(filePath);
                setStartState(menuGroups);
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
