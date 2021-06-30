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

    const [brokerAccountModelActiveTab, setBrokerAccountModelActiveTab] = useState<number>();

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
            <Dropdown item icon="cog" simple className={styles.additionalHeaderIcon} direction="left">
                <Dropdown.Menu>
                    <Dropdown.Item onClick={importToCsv}>Экспорт в CSV...</Dropdown.Item>
                    <Dropdown.Divider />
                    {
                        currentPortfolioType === BrokeragePortfolioTypes.BROKER_ACCOUNT
                            ? (
                                <Dropdown.Item onClick={() => setBrokerAccountModelActiveTab(0)}>
                                    Загрузка отчета брокера
                                </Dropdown.Item>
                            )
                            : null
                    }
                </Dropdown.Menu>
            </Dropdown>
            {
                brokerAccountModelActiveTab !== undefined
                    ? (
                        <SettingsModal
                            onClose={() => setBrokerAccountModelActiveTab(undefined)} activeTab={brokerAccountModelActiveTab}
                        />
                    )
                    : null
            }
        </>
    );
}
