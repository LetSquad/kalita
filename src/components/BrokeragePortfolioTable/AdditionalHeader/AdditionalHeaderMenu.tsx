import { app, dialog } from "@electron/remote";
import fs from "fs-extra";
import React, { useCallback, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Dropdown } from "semantic-ui-react";
import { BrokeragePortfolioTypes } from "../../../models/portfolios/enums";
import SettingsModal from "./SettingsModal/SettingsModal";
import styles from "./styles/AdditionalHeader.scss";

interface Props {
    currentPortfolioType: BrokeragePortfolioTypes,
    importTableToCsvText: () => string | undefined;
}

export function AdditionalHeaderMenu({ currentPortfolioType, importTableToCsvText }: Props) {
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
            <Dropdown item icon="cog" simple closeOnChange className={styles.additionalHeaderIcon} direction="left">
                <Dropdown.Menu>
                    <Dropdown.Item onClick={importToCsv}>Экспорт в CSV...</Dropdown.Item>
                    {
                        currentPortfolioType === BrokeragePortfolioTypes.MODEL_PORTFOLIO ? (
                            <>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => setSettingsModalActiveTab(0)}>
                                    Источники данных
                                </Dropdown.Item>
                            </>
                        ) : (
                            <>
                                <Dropdown.Divider />
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
                        <SettingsModal
                            currentPortfolioType={currentPortfolioType}
                            onClose={() => setSettingsModalActiveTab(undefined)}
                            activeTab={settingsModalActiveTab}
                        />
                    )
                    : null
            }
        </>
    );
}
