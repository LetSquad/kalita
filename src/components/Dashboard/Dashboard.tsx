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
import { SidebarMenuGroupData } from "../../models/menu/types";
import { Portfolios } from "../../models/portfolios/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPortfolios } from "../../store/portfolios/portfoliosReducer";
import { setCurrentProjectName, setMenuGroups } from "../../store/sidebarMenu/sidebarMenuReducer";
import partsStyles from "../../styles/parts.scss";
import DashboardContent from "./DashboardContent";
import SidebarMenu from "./SidebarMenu/SidebarMenu";
import styles from "./styles/Dashboard.scss";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { addToast } = useToasts();

    const modelPortfoliosMenu = useAppSelector((state) => state.sidebarMenu.modelPortfolios);
    const brokerAccountsMenu = useAppSelector((state) => state.sidebarMenu.brokerAccounts);
    const modelPortfoliosData = useAppSelector((state) => state.portfolios.modelPortfolios);
    const brokerAccountsData = useAppSelector((state) => state.portfolios.brokerAccounts);
    const projectName = useAppSelector((state) => state.sidebarMenu.currentProjectName);
    const portfolioName = useAppSelector((state) => state.sidebarMenu.currentPortfolioName);

    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

    const setStartState = useCallback(({ menu, portfolios }: { menu: SidebarMenuGroupData, portfolios: Portfolios }) => {
        dispatch(setMenuGroups(menu));
        dispatch(setPortfolios(portfolios));
    }, [dispatch]);

    const closeSidebarTitle = useMemo(
        () => `${projectName}${portfolioName ? ` :: ${portfolioName}` : ""}`,
        [portfolioName, projectName]
    );

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
