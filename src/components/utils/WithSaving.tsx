import { useCallback, useEffect, useMemo } from "react";

import fs from "fs-extra";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import { currentSaveFileVersion, saveProjectFileName } from "../../models/constants";
import { SidebarMenuGroupData } from "../../models/menu/types";
import { Portfolios } from "../../models/portfolios/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPortfolios } from "../../store/portfolios/portfoliosReducer";
import { setMenuGroups } from "../../store/sidebarMenu/sidebarMenuReducer";

export function WithSaving(props: { children: JSX.Element }): JSX.Element {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { addToast } = useToasts();

    const modelPortfoliosMenu = useAppSelector((state) => state.sidebarMenu.modelPortfolios);
    const brokerAccountsMenu = useAppSelector((state) => state.sidebarMenu.brokerAccounts);
    const modelPortfoliosData = useAppSelector((state) => state.portfolios.modelPortfolios);
    const brokerAccountsData = useAppSelector((state) => state.portfolios.brokerAccounts);

    const currentProjectPath = useMemo(() => searchParams.get("currentProject"), [searchParams]);

    const setStartState = useCallback(({ menu, portfolios }: {
        menu: SidebarMenuGroupData,
        portfolios: Portfolios
    }) => {
        dispatch(setMenuGroups(menu));
        dispatch(setPortfolios(portfolios));
    }, [dispatch]);

    useEffect(() => {
        const filePath = `${currentProjectPath}/${saveProjectFileName}`;

        if (fs.existsSync(filePath)) {
            try {
                const saveFile: {
                    version: string,
                    content: { menu: SidebarMenuGroupData, portfolios: Portfolios }
                } = fs.readJSONSync(filePath);
                setStartState(saveFile.content);
            } catch {
                addToast(`Ошибка открытия проекта "${currentProjectPath}"`, { appearance: "error" });
                navigate("/");
            }
        } else {
            addToast(`Проект "${currentProjectPath}" отсутствует или сломан`, { appearance: "error" });
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (currentProjectPath !== "") {
            const filePath = `${currentProjectPath}/${saveProjectFileName}`;
            fs.writeJson(filePath, {
                version: currentSaveFileVersion,
                content: {
                    menu: { modelPortfolios: modelPortfoliosMenu, brokerAccounts: brokerAccountsMenu },
                    portfolios: { modelPortfolios: modelPortfoliosData, brokerAccounts: brokerAccountsData }
                }
            })
                .catch(() => {
                    addToast(`Ошибка сохранения проекта "${currentProjectPath}"`, { appearance: "error" });
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelPortfoliosMenu, brokerAccountsMenu, modelPortfoliosData, brokerAccountsData]);

    return props.children;
}
