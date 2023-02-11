import { Icon } from "semantic-ui-react";

import styles from "./styles/AdditionalHeader.scss";

interface Props {
    isChartMode: boolean
    onToggleChartMode: () => unknown
}

export function AdditionalHeader({ isChartMode, onToggleChartMode }: Props) {
    return (
        <div className={styles.additionalHeader}>
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
