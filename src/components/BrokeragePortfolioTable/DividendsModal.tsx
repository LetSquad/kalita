import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import { Loader, Modal, Table } from "semantic-ui-react";

import { getStockDividends } from "../../apis/moexApi";
import { QuoteDividends } from "../../models/apis/types";
import partsStyle from "../../styles/parts.scss";
import { getSymbol } from "../../utils/currencyUtils";
import styles from "./styles/DividendsModal.scss";

interface DividendsModalProps {
    ticker: string;
    onClose: () => void;
}

export default function DividendsModal({ ticker, onClose }: DividendsModalProps) {
    const [dividends, setDividends] = useState<QuoteDividends[]>();
    const [isDividendsLoading, setIsDividendsLoading] = useState<boolean>(true);

    useEffect(() => {
        getStockDividends(ticker)
            .then((result) => setDividends(result))
            .finally(() => setIsDividendsLoading(false));
    }, [ticker]);

    const contentTable = useCallback((_dividends: QuoteDividends[]) => (
        <Table
            basic="very"
            celled
            collapsing
            className={styles.table}
        >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                    <Table.HeaderCell>Дивиденды</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    _dividends.filter((dividend) => dividend.value !== 0)
                        .sort(
                            (first, second) => Date.parse(second.date) - Date.parse(first.date)
                        ).map((dividend) => (
                            <Table.Row key={dividend.date}>
                                <Table.Cell>{dividend.date}</Table.Cell>
                                <Table.Cell>{`${dividend.value} ${getSymbol(dividend.currency)}`}</Table.Cell>
                            </Table.Row>
                        ))
                }
            </Table.Body>
        </Table>
    ), []);

    const content = useMemo(() => {
        if (isDividendsLoading) {
            return (
                <div className={partsStyle.loaderContainer}>
                    <Loader
                        active
                        inline="centered"
                    />
                </div>
            );
        }

        if (dividends && dividends.length > 0) {
            return contentTable(dividends);
        }

        return <span className={styles.noDividendContent}>Дивиденды отсутствуют</span>;
    }, [contentTable, dividends, isDividendsLoading]);

    return (
        <Modal
            closeIcon
            onClose={onClose}
            open
        >
            <Modal.Header className={partsStyle.modalHeader}>Дивиденды</Modal.Header>
            <Modal.Content
                scrolling
                className={partsStyle.modalContent}
            >
                {content}
            </Modal.Content>
        </Modal>
    );
}
