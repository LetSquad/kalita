import React, { useCallback } from "react";
import { Icon } from "semantic-ui-react";
import { BrokeragePortfolioTypes } from "../../../models/portfolios/enums";
import { AdditionalHeaderMenu } from "./AdditionalHeaderMenu";
import styles from "./styles/AdditionalHeader.scss";
import { getMoexQuotes } from "../../../apis/moexApi";
import { useAppDispatch } from "../../../store/hooks";
import { addNewGroup } from "../../../store/table/tableReducer";

interface Props {
    currentPortfolioType: BrokeragePortfolioTypes,
    additionalHeaderPart?: JSX.Element,
    importTableToCsvText: () => string | undefined;
}

export function AdditionalHeader({
    currentPortfolioType, additionalHeaderPart, importTableToCsvText
}: Props) {
    const dispatch = useAppDispatch();

    const addGroup = useCallback(() => {
        dispatch(addNewGroup());
    }, [dispatch]);

    const updateQuotesCurrentPrice = useCallback(() => {
        dispatch(getMoexQuotes());
    }, [dispatch]);

    return (
        <div className={styles.additionalHeader}>
            <div className={styles.additionalHeaderPart}>
                {additionalHeaderPart}
            </div>
            <div>
                <AdditionalHeaderMenu currentPortfolioType={currentPortfolioType} importTableToCsvText={importTableToCsvText} />
                <Icon name="sync alternate" link className={styles.additionalHeaderIcon} onClick={() => updateQuotesCurrentPrice()} />
                <Icon name="plus" link className={styles.additionalHeaderIcon} onClick={() => addGroup()} />
            </div>
        </div>
    );
}
