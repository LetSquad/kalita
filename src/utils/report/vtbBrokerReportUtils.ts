import { BrokerReportData, BrokerReportDeal, BrokerReportPosition } from "../../models/table/types";

const CHAPTER_ACCOUNT_NAME = "Подробности";
const CHAPTER_DEALS = "Подробности9";
const CHAPTER_POSITIONS = "Подробности21";

function parseVtbDeals(data: any): Map<string, BrokerReportDeal[]> {
    const dealsSection = data.Report.Tablix_b9;
    if (!dealsSection || dealsSection.length === 0) return new Map();

    const deals: BrokerReportDeal[] = dealsSection[`${CHAPTER_DEALS}_Collection`][CHAPTER_DEALS]
        .map((deal: any) => ({
            code: deal.$.NameBeg9,
            price: Number.parseFloat(deal.$.deal_price7),
            quantity: Number.parseInt(deal.$.NameEnd9, 10)
        }));
    const dealsMap = new Map<string, BrokerReportDeal[]>();
    for (const deal of deals) {
        if (dealsMap.has(deal.code)) {
            dealsMap.get(deal.code)?.push(deal);
        } else {
            dealsMap.set(deal.code, [deal]);
        }
    }
    return dealsMap;
}

export function parseVtbReport(brokerName: string, data: any): BrokerReportData {
    const accountNumber: string = data.Report
        .Tablix_h2_acc[`${CHAPTER_ACCOUNT_NAME}_Collection`][CHAPTER_ACCOUNT_NAME]
        .$.AccNum;
    const accountName = `${brokerName}: ${accountNumber}`;

    const positionsSection = data.Report.Tablix6;
    if (positionsSection === null || positionsSection.length === 0) return { accountName, positions: [] };

    const dealsMap = parseVtbDeals(data);
    const positions: BrokerReportPosition[] = data.Report
        .Tablix6
        .bond_type_Collection
        .bond_type[0]
        .FinInstr_Collection
        .FinInstr
        .map((instrument: any) => {
            const fullCode: string = instrument.$.FinInstr;
            let totalPrice = 0;
            let totalQuantity = 0;
            if (dealsMap.get(fullCode)) {
                const deals = dealsMap.get(fullCode);
                if (deals) {
                    for (const deal of deals) {
                        totalPrice += deal.price * deal.quantity;
                        totalQuantity += deal.quantity;
                    }
                }
            }

            return ({
                code: fullCode.split(", ")[0],
                averagePrice: Math.round((totalPrice / totalQuantity) * 100) / 100,
                quantity: Number.parseInt(
                    instrument.deal_place_Collection
                        .deal_place[`${CHAPTER_POSITIONS}_Collection`][CHAPTER_POSITIONS]
                        .$.remains_plan,
                    10
                )
            });
        });
    return { accountName, positions };
}
