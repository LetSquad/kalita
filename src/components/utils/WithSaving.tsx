import React, { useCallback, useEffect, useMemo } from "react";

import fs from "fs-extra";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    backupProjectFileTemplate,
    currentSaveFileVersion,
    saveProjectFileName,
    snapshotProjectFileTemplate
} from "../../models/constants";
import { SidebarMenuGroupData } from "../../models/menu/types";
import { Portfolios } from "../../models/portfolios/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPortfolios, setProjectReadyForSavingStatus, setSavingInProgress } from "../../store/portfolios/portfoliosReducer";
import { setSettings, SettingsState } from "../../store/settings/settingsReducer";
import { setMenuGroups } from "../../store/sidebarMenu/sidebarMenuReducer";

const SAVE_PROJECT_TOAST_ID = "save-project";

export function WithSaving(props: { children: React.JSX.Element }): React.JSX.Element {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const modelPortfoliosMenu = useAppSelector((state) => state.sidebarMenu.modelPortfolios);
    const brokerAccountsMenu = useAppSelector((state) => state.sidebarMenu.brokerAccounts);
    const modelPortfoliosData = useAppSelector((state) => state.portfolios.modelPortfolios);
    const brokerAccountsData = useAppSelector((state) => state.portfolios.brokerAccounts);
    const projectSettings = useAppSelector((state) => state.settings);

    const isSavingInProgress = useAppSelector((state) => state.portfolios.isSavingInProgress);
    const isProjectReadyForSaving = useAppSelector((state) => state.portfolios.isProjectReadyForSaving);

    const currentProjectPath = useMemo(() => searchParams.get("currentProject"), [searchParams]);

    const setStartState = useCallback(({ menu, portfolios, settings }: {
        menu: SidebarMenuGroupData,
        portfolios: Portfolios,
        settings?: SettingsState
    }) => {
        dispatch(setMenuGroups(menu));
        dispatch(setPortfolios(portfolios));
        dispatch(setSettings(settings));
        dispatch(setProjectReadyForSavingStatus(true));
    }, [dispatch]);

    useEffect(() => {
        const filePath = `${currentProjectPath}/${saveProjectFileName}`;
        const snapshotPath = `${currentProjectPath}/${snapshotProjectFileTemplate}.json`;

        if (fs.existsSync(filePath)) {
            try {
                fs.copyFileSync(filePath, snapshotPath);

                const saveFile: {
                    version: string,
                    content: { menu: SidebarMenuGroupData, portfolios: Portfolios, settings?: SettingsState }
                } = fs.readJSONSync(filePath);

                setStartState(saveFile.content);
            } catch (error) {
                console.error(error);

                fs.copyFileSync(snapshotPath, `${currentProjectPath}/${snapshotProjectFileTemplate}_${Date.now()}.json`);
                toast.error(`Ошибка открытия проекта "${currentProjectPath}"`, { id: SAVE_PROJECT_TOAST_ID });
                navigate("/");
            }
        } else {
            toast.error(`Проект "${currentProjectPath}" отсутствует или сломан`, { id: SAVE_PROJECT_TOAST_ID });
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (currentProjectPath !== "" && !isSavingInProgress && isProjectReadyForSaving) {
            dispatch(setSavingInProgress(true));

            const filePath = `${currentProjectPath}/${saveProjectFileName}`;
            const backupPath = `${currentProjectPath}/${backupProjectFileTemplate}.json`;
            fs.copyFile(filePath, backupPath)
                .then(() => fs.writeJson(filePath, {
                    version: currentSaveFileVersion,
                    content: {
                        menu: { modelPortfolios: modelPortfoliosMenu, brokerAccounts: brokerAccountsMenu },
                        portfolios: { modelPortfolios: modelPortfoliosData, brokerAccounts: brokerAccountsData },
                        settings: projectSettings
                    }
                }))
                .then(() => dispatch(setSavingInProgress(false)))
                .catch((error) => {
                    console.error(error);

                    fs.copyFile(backupPath, `${currentProjectPath}/${backupProjectFileTemplate}_${Date.now()}.json`)
                        .then(() => toast.error(
                            `Ошибка сохранения проекта "${currentProjectPath}"`,
                            { id: SAVE_PROJECT_TOAST_ID }
                        ));
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelPortfoliosMenu, brokerAccountsMenu, modelPortfoliosData, brokerAccountsData, projectSettings]);

    return props.children;
}
