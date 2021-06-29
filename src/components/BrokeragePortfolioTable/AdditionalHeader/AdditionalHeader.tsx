import React from "react";
import { Icon } from "semantic-ui-react";
import { BrokeragePortfolioTypes } from "../../../models/portfolios/enums";
import { AdditionalHeaderMenu } from "./AdditionalHeaderMenu";
import styles from "./styles/AdditionalHeader.scss";

interface Props {
    currentPortfolioType: BrokeragePortfolioTypes,
    additionalHeaderPart?: JSX.Element,
    addGroup: () => void,
    importTableToCsvText: () => string | undefined;
}

export function AdditionalHeader({
    currentPortfolioType, additionalHeaderPart, addGroup, importTableToCsvText
}: Props) {
    return (
        <div className={styles.additionalHeader}>
            <div className={styles.additionalHeaderPart}>
                {additionalHeaderPart}
            </div>
            <div>
                <AdditionalHeaderMenu currentPortfolioType={currentPortfolioType} importTableToCsvText={importTableToCsvText} />
                <Icon name="plus" link className={styles.additionalHeaderIcon} onClick={() => addGroup()} />
            </div>
        </div>
    );
}
