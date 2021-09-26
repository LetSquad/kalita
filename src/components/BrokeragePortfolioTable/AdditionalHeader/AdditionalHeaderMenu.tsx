import { app, dialog } from "@electron/remote";
import fs from "fs-extra";
import React, { lazy, useCallback, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Dropdown } from "semantic-ui-react";
import { BrokeragePortfolioTypes } from "../../../models/portfolios/enums";
import { Portfolio } from "../../../models/portfolios/types";
import { WithSuspense } from "../../utils/WithSuspense";
import styles from "./styles/AdditionalHeaderMenu.scss";
import headerStyles from "./styles/AdditionalHeader.scss";

interface Props {
    currentPortfolio: Portfolio,
    importTableToCsvText: () => string | undefined;
}

const SettingsModal = lazy(/* webpackChunkName: "settingsModal" */() =>
    import("./SettingsModal/SettingsModal"));

export function AdditionalHeaderMenu({ currentPortfolio, importTableToCsvText }: Props) {
    const { addToast } = useToasts();

    const [settingsModalActiveTab, setSettingsModalActiveTab] = useState<number>();

    const importToCsv = useCallback(() => {
        const path = dialog.showSaveDialogSync({
            title: "Сохранить CSV",
            defaultPath: `${app.getPath("home")}/portfolio.csv`,
            filters: [{
                name: "csv",
                extensions: ["csv"]
            }]
        });

        if (path) {
            const content = importTableToCsvText();
            if (content) {
                try {
                    fs.createFileSync(path);
                    fs.writeFileSync(path, content);
                    addToast(`Портфель успешно экспортирован в файл ${path}`, { appearance: "success" });
                } catch {
                    addToast("Произошла ошибка при сохранении таблицы в csv файл", { appearance: "error" });
                }
            }
        }
    }, [addToast, importTableToCsvText]);

    return (
        <>
            <Dropdown item icon="cog" simple closeOnChange className={headerStyles.additionalHeaderIcon} direction="left">
                <Dropdown.Menu>
                    <Dropdown.Item onClick={importToCsv}>Экспорт в CSV...</Dropdown.Item>
                    <Dropdown.Divider className={styles.divider} />
                    {
                        currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO ? (
                            <>
                                <Dropdown.Item onClick={() => setSettingsModalActiveTab(0)}>
                                    Источники данных
                                </Dropdown.Item>
                            </>
                        ) : (
                            <>
                                <Dropdown.Item onClick={() => setSettingsModalActiveTab(0)}>
                                    Загрузка отчёта брокера
                                </Dropdown.Item>
                            </>
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
            {
                settingsModalActiveTab !== undefined
                    ? (
                        <WithSuspense>
                            <SettingsModal
                                currentPortfolio={currentPortfolio}
                                onClose={() => setSettingsModalActiveTab(undefined)}
                                activeTab={settingsModalActiveTab}
                            />
                        </WithSuspense>
                    )
                    : null
            }
        </>
    );
}
