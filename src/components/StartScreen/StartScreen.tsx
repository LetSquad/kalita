import { app, dialog } from "@electron/remote";
import fs from "fs-extra";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Button, Icon } from "semantic-ui-react";
import { saveProjectFileName } from "../../model/constants";
import { addRecentProject, removeRecentProject } from "../../store/electronCache/electronCacheReducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { baseSidebarMenuGroups } from "../../store/sidebarMenu/sidebarMenuReducerHelper";
import { Kalita } from "../Kalita/Kalita";
import styles from "./styles/StartScreen.scss";

export default function StartScreen() {
    const dispatch = useAppDispatch();
    const history = useHistory();

    const recentProjects = useAppSelector((state) => state.electronCache.recentProjects);

    const { addToast } = useToasts();

    const addRecent = useCallback((path: string) => {
        dispatch(addRecentProject(path));
    }, [dispatch]);

    const removeRecent = useCallback((recentProjectId: string) => {
        dispatch(removeRecentProject(recentProjectId));
    }, [dispatch]);

    const createNewProject = useCallback(() => {
        const path = dialog.showSaveDialogSync({
            defaultPath: `${app.getPath("home")}/Новый проект`,
            buttonLabel: "Создать",
            title: "Создание нового проекта"
        });
        if (path) {
            let dirContentCount;
            try {
                dirContentCount = fs.readdirSync(path).length;
            } catch {
                dirContentCount = 0;
            }
            if (dirContentCount > 0) {
                addToast("Папка не пустая", { appearance: "warning" });
            } else {
                try {
                    fs.mkdirpSync(path);
                    const filePath = `${path}/${saveProjectFileName}`;
                    fs.createFileSync(filePath);
                    fs.writeJsonSync(filePath, baseSidebarMenuGroups);
                    addRecent(path);
                    history.push(`/dashboard?currentProject=${path}`);
                } catch {
                    fs.removeSync(path);
                    addToast("Ошибка при создании проекта", { appearance: "error" });
                }
            }
        }
    }, [addRecent, addToast, history]);

    const openProjectByPath = useCallback((path: string) => {
        addRecent(path);
        history.push(`/dashboard?currentProject=${path}`);
    }, [addRecent, history]);

    const openRecentProject = useCallback((path: string) => {
        if (fs.existsSync(path)) {
            openProjectByPath(path);
        } else {
            addToast(`Проект "${path}" не найден`, { appearance: "warning" });
            removeRecent(path);
        }
    }, [addToast, openProjectByPath, removeRecent]);

    const openProject = useCallback(() => {
        const path = dialog.showOpenDialogSync({
            defaultPath: `${app.getPath("home")}`,
            buttonLabel: "Открыть",
            title: "Открытие проекта",
            properties: ["openDirectory"]
        })?.[0];

        if (path) {
            openProjectByPath(path);
        }
    }, [openProjectByPath]);

    const buttons = useMemo(() => (
        <div className={recentProjects.length === 0
            ? styles.buttonsContainerCombined
            : styles.buttonsContainerSplit}
        >
            <Button onClick={createNewProject}>Новый проект</Button>
            <Button onClick={openProject}>Открыть...</Button>
        </div>
    ), [createNewProject, openProject, recentProjects.length]);

    return (
        <div className={styles.startScreen}>
            <div
                className={
                    recentProjects.length === 0
                        ? styles.kalitaContainerCombined
                        : styles.kalitaContainerSplit
                }
            >
                <Kalita />
                {
                    recentProjects.length === 0
                        ? buttons
                        : null
                }
            </div>
            <div className={styles.separator} />
            {
                recentProjects.length > 0
                    ? (
                        <div className={styles.projectsContainer}>
                            {buttons}
                            <div className={styles.recent}>
                                <span className={styles.recentTitle}>Recent: </span>
                                {recentProjects.map((recent) => (
                                    <div className={styles.recentProject} key={recent[0]}>
                                        <span
                                            aria-hidden onClick={() => openRecentProject(recent[1])}
                                            className={styles.recentProjectTitle}
                                        >
                                            {recent[1]}
                                        </span>
                                        <Icon name="close" link onClick={() => removeRecent(recent[0])} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                    : null
            }
        </div>
    );
}