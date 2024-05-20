import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import { getMoexCurrencyQuotes } from "../../apis/moexApi";
import { CurrencyQuotesMap } from "../../models/apis/types";
import { ModelPortfolioMenuGroup } from "../../models/menu/types";
import { Currency } from "../../models/portfolios/enums";
import { BrokerAccount, ModelPortfolio } from "../../models/portfolios/types";
import { useAppSelector } from "../../store/hooks";
import { AdditionalHeader } from "./AdditionalHeader/AdditionalHeader";
import AnalyticsChart from "./AnalyticsChart/AnalyticsChart";
import AnalyticsTable from "./AnalyticsTable/AnalyticsTable";
import styles from "./styles/Analytics.scss";

export default function Analytics() {
    const [analyticsCurrency, setAnalyticsCurrency] = useState<Currency>(Currency.RUB);
    const [isChartMode, setIsChartMode] = useState<boolean>(false);
    const [currencyQuotes, setCurrencyQuotes] = useState<CurrencyQuotesMap>();

    const modelPortfolioNames: ModelPortfolioMenuGroup = useAppSelector((state) => (
        state.sidebarMenu.modelPortfolios
    ));
    const modelPortfolios: ModelPortfolio[] = useAppSelector((state) => (
        state.portfolios.modelPortfolios
    ));

    const brokerAccounts: BrokerAccount[] = useAppSelector((state) => (
        state.portfolios.brokerAccounts
    ));

    const onCurrencyQuotesLoaded = useCallback((quotes: CurrencyQuotesMap) => {
        setCurrencyQuotes(quotes);
    }, [setCurrencyQuotes]);

    useEffect(() => {
        getMoexCurrencyQuotes()
            .then(onCurrencyQuotesLoaded);
    }, [onCurrencyQuotesLoaded]);

    const chart = useMemo(() => (
        currencyQuotes
            ? (
                <AnalyticsChart
                    analyticsCurrency={analyticsCurrency}
                    currencyQuotes={currencyQuotes}
                    modelPortfolios={modelPortfolios}
                    brokerAccounts={brokerAccounts}
                />
            ) : undefined
    ), [analyticsCurrency, modelPortfolios, brokerAccounts, currencyQuotes]);

    const table = useMemo(() => (
        currencyQuotes
            ? (
                <AnalyticsTable
                    analyticsCurrency={analyticsCurrency}
                    currencyQuotes={currencyQuotes}
                    modelPortfolioNames={modelPortfolioNames}
                    modelPortfolios={modelPortfolios}
                    brokerAccounts={brokerAccounts}
                />
            ) : undefined
    ), [analyticsCurrency, modelPortfolioNames, modelPortfolios, brokerAccounts, currencyQuotes]);

    const handleSelectAnalyticsCurrency = useCallback((currency: Currency) => {
        setAnalyticsCurrency(currency);
    }, [setAnalyticsCurrency]);

    const handleToggleChartMode = useCallback(() => {
        setIsChartMode((old) => !old);
    }, [setIsChartMode]);

    return (
        <div className={styles.container}>
            <AdditionalHeader
                analyticsCurrency={analyticsCurrency}
                isChartMode={isChartMode}
                onSelectAnalyticsCurrency={handleSelectAnalyticsCurrency}
                onToggleChartMode={handleToggleChartMode}
            />
            {
                isChartMode
                    ? chart
                    : table
            }
        </div>
    );
}
