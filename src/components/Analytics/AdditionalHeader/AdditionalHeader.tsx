import { useMemo } from "react";

import { Dropdown, Icon } from "semantic-ui-react";

import { Currency } from "../../../models/portfolios/enums";
import { getSymbol } from "../../../utils/currencyUtils";
import styles from "./styles/AdditionalHeader.scss";

interface Props {
    analyticsCurrency: Currency
    isChartMode: boolean
    onSelectAnalyticsCurrency: (currency: Currency) => unknown
    onToggleChartMode: () => unknown
}

export function AdditionalHeader(
    {
        analyticsCurrency,
        isChartMode,
        onSelectAnalyticsCurrency,
        onToggleChartMode
    }: Props
) {
    const allCurrencies = useMemo(() => (
        Object.values(Currency)
            .map((c) => ({ key: c, text: getSymbol(c), value: c }))
    ), []);

    return (
        <div className={styles.additionalHeader}>
            <div className={styles.additionalHeaderCurrency}>
                Валюта:
                <Dropdown
                    className={styles.currencyDropdown}
                    options={allCurrencies}
                    value={analyticsCurrency}
                    onChange={(_, data) => onSelectAnalyticsCurrency(data.value as Currency)}
                />
            </div>
            <div>
                <Icon
                    name={isChartMode ? "table" : "chart pie"}
                    link
                    className={styles.additionalHeaderIcon}
                    onClick={onToggleChartMode}
                />
            </div>
        </div>
    );
}
