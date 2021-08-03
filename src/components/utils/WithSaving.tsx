import fs from "fs-extra";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { currentSaveFileVersion, saveProjectFileName } from "../../models/constants";
import { SidebarMenuGroupData } from "../../models/menu/types";
import { Portfolios } from "../../models/portfolios/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPortfolios } from "../../store/portfolios/portfoliosReducer";
import { setMenuGroups } from "../../store/sidebarMenu/sidebarMenuReducer";

export function WithSaving(props: { children: JSX.Element }): JSX.Element {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { addToast } = useToasts();

    const modelPortfoliosMenu = useAppSelector((state) => state.sidebarMenu.modelPortfolios);
    const brokerAccountsMenu = useAppSelector((state) => state.sidebarMenu.brokerAccounts);
    const modelPortfoliosData = useAppSelector((state) => state.portfolios.modelPortfolios);
    const brokerAccountsData = useAppSelector((state) => state.portfolios.brokerAccounts);

    const setStartState = useCallback(({ menu, portfolios }: {
        menu: SidebarMenuGroupData,
        portfolios: Portfolios,
    }) => {
        dispatch(setMenuGroups(menu));
        dispatch(setPortfolios(portfolios));
    }, [dispatch]);

    useEffect(() => {
        const folderPath = decodeURI(history.location.search.replace("?currentProject=", ""));
        const filePath = `${folderPath}/${saveProjectFileName}`;

        if (fs.existsSync(filePath)) {
            try {
                const saveFile: {
                    version: string,
                    content: { menu: SidebarMenuGroupData, portfolios: Portfolios }
                } = fs.readJSONSync(filePath);
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
            fs.writeJson(filePath, {
                version: currentSaveFileVersion,
                content: {
                    menu: { modelPortfolios: modelPortfoliosMenu, brokerAccounts: brokerAccountsMenu },
                    portfolios: { modelPortfolios: modelPortfoliosData, brokerAccounts: brokerAccountsData }
                }
            })
                .catch(() => {
                    addToast(`Ошибка сохранения проекта "${folderPath}"`, { appearance: "error" });
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelPortfoliosMenu, brokerAccountsMenu, modelPortfoliosData, brokerAccountsData]);

    return props.children;
}
