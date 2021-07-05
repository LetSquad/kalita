import { BrokerReportData, BrokerReportDeal, BrokerReportPosition } from "../../models/table/types";

const DEALS_CHAPTER_NUMBER = "1.1";
const DEALS_CHAPTER_SUBHEADER = "Номер сделки";
const DEAL_TYPE_INDEX = "_27";
const DEAL_TICKER_INDEX = "_39";
const DEAL_PRICE_INDEX = "_44";
const DEAL_QUANTITY_INDEX = "_53";
const DEAL_TYPE_BUY = "Покупка";

const OTHER_DEALS_CHAPTER_NUMBER = "1.2";

const POSITIONS_CHAPTER_NUMBER = "3.1";
const POSITIONS_CHAPTER_SUBHEADER = "Сокращенное наименование актива";
const POSITION_TICKER_INDEX = "_14";
const POSITION_QUANTITY_INDEX = "_87";

const OTHER_POSITIONS_CHAPTER_NUMBER = "3.2";

export function parseTinkoffReport(brokerName: string, data: any[]): BrokerReportData {
    const dealsMap = new Map<string, BrokerReportDeal[]>();
    const positions: BrokerReportPosition[] = [];

    let currentChapterNumber: string | null = null;
    for (const row of data) {
        const name = row[""];
        if (name.startsWith(DEALS_CHAPTER_NUMBER)) {
            currentChapterNumber = DEALS_CHAPTER_NUMBER;
        } else if (name.startsWith(OTHER_DEALS_CHAPTER_NUMBER)) {
            currentChapterNumber = OTHER_DEALS_CHAPTER_NUMBER;
        } else if (name.startsWith(POSITIONS_CHAPTER_NUMBER)) {
            currentChapterNumber = POSITIONS_CHAPTER_NUMBER;
        } else if (name.startsWith(OTHER_POSITIONS_CHAPTER_NUMBER)) {
            currentChapterNumber = OTHER_POSITIONS_CHAPTER_NUMBER;
        } else if (
            currentChapterNumber === DEALS_CHAPTER_NUMBER &&
            name !== DEALS_CHAPTER_SUBHEADER &&
            row[DEAL_TYPE_INDEX] === DEAL_TYPE_BUY
        ) {
            const deal = {
                code: row[DEAL_TICKER_INDEX],
                price: Number.parseFloat(row[DEAL_PRICE_INDEX].replace(",", ".")),
                quantity: Number.parseInt(row[DEAL_QUANTITY_INDEX], 10)
            };
            if (dealsMap.has(deal.code)) {
                dealsMap.get(deal.code)?.push(deal);
            } else {
                dealsMap.set(deal.code, [deal]);
            }
        } else if (currentChapterNumber === POSITIONS_CHAPTER_NUMBER && name !== POSITIONS_CHAPTER_SUBHEADER) {
            const ticker = row[POSITION_TICKER_INDEX];
            let totalPrice = 0;
            let totalQuantity = 0;
            const deals = dealsMap.get(ticker);
            if (deals) {
                for (const deal of deals) {
                    totalPrice += deal.price * deal.quantity;
                    totalQuantity += deal.quantity;
                }
            }
            positions.push({
                code: ticker,
                averagePrice: Math.round((totalPrice / totalQuantity) * 100) / 100,
                quantity: Number.parseInt(row[POSITION_QUANTITY_INDEX], 10)
            });
        }
    }
    return { accountName: brokerName, positions };
}
