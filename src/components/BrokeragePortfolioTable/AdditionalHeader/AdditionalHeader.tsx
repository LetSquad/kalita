import { useCallback } from "react";

import { Icon } from "semantic-ui-react";

import { loadMoexQuotesByTickers } from "../../../apis/moexApi";
import { BrokeragePortfolioTypes } from "../../../models/portfolios/enums";
import { Portfolio } from "../../../models/portfolios/types";
import { ModelPortfolioPriceMode } from "../../../models/settings/enums";
import { useAppDispatch } from "../../../store/hooks";
import { addNewGroup } from "../../../store/portfolios/portfoliosReducer";
import { AdditionalHeaderMenu } from "./AdditionalHeaderMenu";
import styles from "./styles/AdditionalHeader.scss";

interface Props {
    currentPortfolio: Portfolio,
    additionalHeaderPart?: JSX.Element,
    importTableToCsvText: () => string | undefined,
    isChartMode: boolean
    onToggleChartMode: () => unknown
}

export function AdditionalHeader({
    currentPortfolio, additionalHeaderPart, importTableToCsvText, isChartMode, onToggleChartMode
}: Props) {
    const dispatch = useAppDispatch();

    const addGroup = useCallback(() => {
        dispatch(addNewGroup());
    }, [dispatch]);

    const updateQuotesCurrentPrice = useCallback(() => {
        const tickers: string[] = currentPortfolio.positions.map((position) => position.ticker);
        dispatch(loadMoexQuotesByTickers(tickers));
    }, [dispatch, currentPortfolio]);

    return (
        <div className={styles.additionalHeader}>
            <div className={styles.additionalHeaderPart}>
                {additionalHeaderPart}
            </div>
            <div>
                <AdditionalHeaderMenu
                    currentPortfolio={currentPortfolio}
                    importTableToCsvText={importTableToCsvText}
                />
                <Icon
                    name={isChartMode ? "table" : "chart pie"}
                    link
                    className={styles.additionalHeaderIcon}
                    onClick={onToggleChartMode}
                />
                {currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO &&
                    currentPortfolio.settings.priceMode === ModelPortfolioPriceMode.MARKET_DATA
                    ? (
                        <Icon
                            name="sync alternate"
                            link
                            className={styles.additionalHeaderIcon}
                            onClick={() => updateQuotesCurrentPrice()}
                        />
                    ) : null}
                <Icon
                    name="plus"
                    link
                    className={styles.additionalHeaderIcon}
                    onClick={() => addGroup()}
                />
            </div>
        </div>
    );
}
