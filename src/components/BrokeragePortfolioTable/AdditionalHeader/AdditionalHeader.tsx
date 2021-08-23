import React, { useCallback } from "react";
import { Icon } from "semantic-ui-react";
import { Portfolio } from "../../../models/portfolios/types";
import { addNewGroup } from "../../../store/portfolios/portfoliosReducer";
import { AdditionalHeaderMenu } from "./AdditionalHeaderMenu";
import styles from "./styles/AdditionalHeader.scss";
import { loadMoexQuotesByTickers } from "../../../apis/moexApi";
import { useAppDispatch } from "../../../store/hooks";

interface Props {
    currentPortfolio: Portfolio,
    additionalHeaderPart?: JSX.Element,
    importTableToCsvText: () => string | undefined;
}

export function AdditionalHeader({
    currentPortfolio, additionalHeaderPart, importTableToCsvText
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
                <AdditionalHeaderMenu currentPortfolio={currentPortfolio} importTableToCsvText={importTableToCsvText} />
                <Icon name="sync alternate" link className={styles.additionalHeaderIcon} onClick={() => updateQuotesCurrentPrice()} />
                <Icon name="plus" link className={styles.additionalHeaderIcon} onClick={() => addGroup()} />
            </div>
        </div>
    );
}
