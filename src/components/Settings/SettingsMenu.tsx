import {
    lazy,
    useCallback,
    useMemo,
    useState
} from "react";

import fs from "fs-extra";
import { useToasts } from "react-toast-notifications";
import { Dropdown } from "semantic-ui-react";

import { app, dialog } from "@electron/remote";

import { BrokeragePortfolioTypes } from "../../models/portfolios/enums";
import { ExtendedPortfolio } from "../../models/portfolios/types";
import headerStyles from "../BrokeragePortfolioTable/AdditionalHeader/styles/AdditionalHeader.scss";
import { WithSuspense } from "../utils/WithSuspense";
import styles from "./styles/AdditionalHeaderMenu.scss";

interface Props {
    currentPortfolio: ExtendedPortfolio,
    importTableToCsvText?: () => string | undefined;
}

const SettingsModal = lazy(/* webpackChunkName: "settingsModal" */() =>
    import("./SettingsModal/SettingsModal"));

export function SettingsMenu({ currentPortfolio, importTableToCsvText }: Props) {
    const { addToast } = useToasts();

    const [settingsModalActiveTab, setSettingsModalActiveTab] = useState<number>();

    const importToCsv = useCallback((_importTableToCsvText: () => string | undefined) => {
        const path = dialog.showSaveDialogSync({
            title: "Сохранить CSV",
            defaultPath: `${app.getPath("home")}/portfolio.csv`,
            filters: [{
                name: "csv",
                extensions: ["csv"]
            }]
        });

        if (path) {
            const content = _importTableToCsvText();
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
    }, [addToast]);

    const commonMenuItems = useMemo(() => (
        <Dropdown.Item onClick={() => setSettingsModalActiveTab(0)}>
            Общие настройки
        </Dropdown.Item>
    ), []);

    const modelPortfolioMenuItems = useMemo(() => (
        <>
            {commonMenuItems}
            <Dropdown.Item onClick={() => setSettingsModalActiveTab(1)}>
                Источники данных
            </Dropdown.Item>
        </>
    ), [commonMenuItems]);

    const brokerAccountMenuItems = useMemo(() => (
        <>
            {commonMenuItems}
            <Dropdown.Item onClick={() => setSettingsModalActiveTab(0)}>
                Загрузка отчёта брокера
            </Dropdown.Item>
        </>
    ), [commonMenuItems]);

    const menuItems = useMemo(() => {
        switch (currentPortfolio.type) {
            case BrokeragePortfolioTypes.BROKER_ACCOUNT: {
                return brokerAccountMenuItems;
            }
            case BrokeragePortfolioTypes.MODEL_PORTFOLIO: {
                return modelPortfolioMenuItems;
            }
            case BrokeragePortfolioTypes.ANALYTICS: {
                return commonMenuItems;
            }
        }
    }, [brokerAccountMenuItems, commonMenuItems, currentPortfolio.type, modelPortfolioMenuItems]);

    return (
        <>
            <Dropdown
                item
                icon="cog"
                simple
                closeOnChange
                className={headerStyles.additionalHeaderIcon}
                direction="left"
            >
                <Dropdown.Menu>
                    {importTableToCsvText && (
                        <>
                            <Dropdown.Item onClick={() => importToCsv(importTableToCsvText)}>Экспорт в CSV...</Dropdown.Item>
                            <Dropdown.Divider className={styles.divider} />
                        </>

                    )}
                    {menuItems}
                </Dropdown.Menu>
            </Dropdown>
            {
                settingsModalActiveTab === undefined
                    ? null
                    : (
                        <WithSuspense>
                            <SettingsModal
                                currentPortfolio={currentPortfolio}
                                onClose={() => setSettingsModalActiveTab(undefined)}
                                activeTab={settingsModalActiveTab}
                            />
                        </WithSuspense>
                    )
            }
        </>
    );
}
