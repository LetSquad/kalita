import { useCallback, useMemo } from "react";

import fs from "fs-extra";
import nodePath from "path";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

import { app, dialog } from "@electron/remote";

import { currentSaveFileVersion, saveProjectFileName } from "../../models/constants";
import { addRecentProject, removeRecentProject } from "../../store/electronCache/electronCacheReducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { baseSidebarMenuGroups } from "../../store/sidebarMenu/sidebarMenuReducerHelper";
import { Kalita } from "../Kalita/Kalita";
import styles from "./styles/StartScreen.scss";

const CREATE_NEW_PROJECT_TOAST_ID = "create-new-project";
const OPEN_PROJECT_TOAST_ID = "open-project";
const OPEN_RECENT_PROJECT_TOAST_ID = "open-recent-project";

export default function StartScreen() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const recentProjects = useAppSelector((state) => state.electronCache.recentProjects);

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
                toast.error("Папка не пустая", { id: CREATE_NEW_PROJECT_TOAST_ID });
            } else {
                try {
                    fs.mkdirpSync(path);
                    const filePath = `${path}/${saveProjectFileName}`;
                    fs.createFileSync(filePath);
                    fs.writeJsonSync(filePath, {
                        version: currentSaveFileVersion,
                        content: {
                            menu: baseSidebarMenuGroups,
                            portfolios: {
                                modelPortfolios: [],
                                brokerAccounts: []
                            }
                        }
                    });
                    addRecent(path);
                    navigate(`/dashboard?currentProject=${path}`);
                } catch {
                    fs.removeSync(path);
                    toast.error("Ошибка при создании проекта", { id: CREATE_NEW_PROJECT_TOAST_ID });
                }
            }
        }
    }, [addRecent, navigate]);

    const openProjectByPath = useCallback((path: string) => {
        if (fs.existsSync(`${path}${nodePath.sep}${saveProjectFileName}`)) {
            addRecent(path);
            navigate(`/dashboard?currentProject=${path}`);
        } else {
            toast.error(`Проект "${path}" сломан`, { id: OPEN_PROJECT_TOAST_ID });
            removeRecent(path);
        }
    }, [addRecent, navigate, removeRecent]);

    const openRecentProject = useCallback((recent: [string, string]) => {
        if (fs.existsSync(recent[1])) {
            openProjectByPath(recent[1]);
        } else {
            toast.error(`Проект "${recent[1]}" не найден`, { id: OPEN_RECENT_PROJECT_TOAST_ID });
            removeRecent(recent[0]);
        }
    }, [openProjectByPath, removeRecent]);

    const openProject = useCallback(() => {
        const path = dialog.showOpenDialogSync({
            defaultPath: `${app.getPath("home")}`,
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
                                    <div
                                        className={styles.recentProject}
                                        key={recent[0]}
                                    >
                                        <div className={styles.recentProjectTitle}>
                                            <span
                                                aria-hidden
                                                onClick={() => openRecentProject(recent)}
                                                className={styles.reverseEllipsisContent}
                                            >
                                                {recent[1]}
                                            </span>
                                        </div>
                                        <Icon
                                            name="close"
                                            link
                                            className={styles.recentProjectCloseLink}
                                            onClick={() => removeRecent(recent[0])}
                                        />
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
