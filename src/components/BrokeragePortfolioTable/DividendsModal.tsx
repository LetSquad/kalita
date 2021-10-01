import { Loader, Modal, Table } from "semantic-ui-react";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { convertResponseToQuotesDividends, getStockDividends } from "../../apis/moexApi";
import { QuoteDividendsDate } from "../../models/apis/types";
import styles from "./styles/DividendsModal.scss";
import partsStyle from "../../styles/parts.scss";

interface DividendsModalProps {
    ticket: string;
    onClose: () => void;
}

export default function DividendsModal({ ticket, onClose }: DividendsModalProps) {
    const [dividends, setDividends] = useState<QuoteDividendsDate[]>();
    const [isDividendsLoading, setIsDividendsLoading] = useState<boolean>(true);

    useEffect(() => {
        getStockDividends(ticket)
            .then((payload) => {
                convertResponseToQuotesDividends(payload.data)
                    .then((result) => setDividends(result))
                    .finally(() => setIsDividendsLoading(false));
            });
    }, [ticket]);

    const contentTable = useCallback((_dividends: QuoteDividendsDate[]) => (
        <Table basic="very" celled collapsing className={styles.table}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                    <Table.HeaderCell>Дивиденды</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {_dividends.filter((dividend) => dividend.value !== 0).map((dividend) => (
                    <Table.Row key={dividend.date}>
                        <Table.Cell>{dividend.date}</Table.Cell>
                        <Table.Cell>{`${dividend.value} ${dividend.currency}`}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    ), []);

    const content = useMemo(() => {
        if (isDividendsLoading) {
            return (
                <div className={partsStyle.loaderContainer}>
                    <Loader active inline="centered" />
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
            <Modal.Content scrolling className={partsStyle.modalContent}>
                {content}
            </Modal.Content>
        </Modal>
    );
}
