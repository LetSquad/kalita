import { BrokerReportData, BrokerReportDeal, BrokerReportPosition } from "../../model/table/types";

const CHAPTER_ACCOUNT_NAME = "Подробности";
const CHAPTER_DEALS = "Подробности9";
const CHAPTER_POSITIONS = "Подробности21";

function parseVtbDeals(data: any): Map<string, Array<BrokerReportDeal>> {
    const dealsSection = data.Report.Tablix_b9[0];
    if (!dealsSection || dealsSection.length === 0) return new Map();

    const deals: Array<BrokerReportDeal> = dealsSection[`${CHAPTER_DEALS}_Collection`][0][CHAPTER_DEALS]
        .map((d: any) => ({
            name: d.$.NameBeg9,
            price: Number.parseFloat(d.$.deal_price7),
            quantity: Number.parseInt(d.$.NameEnd9, 10)
        }));
    const dealsMap = new Map<string, Array<BrokerReportDeal>>();
    for (const deal of deals) {
        if (dealsMap.has(deal.name)) {
            dealsMap.get(deal.name)?.push(deal);
        } else {
            dealsMap.set(deal.name, [deal]);
        }
    }
    return dealsMap;
}

export function parseVtbReport(data: any): BrokerReportData {
    const accountName: string = data.Report
        .Tablix_h2_acc[0][`${CHAPTER_ACCOUNT_NAME}_Collection`][0][CHAPTER_ACCOUNT_NAME][0]
        .$.AccNum;

    const positionsSection = data.Report.Tablix6;
    if (positionsSection === null || positionsSection.length === 0) return { accountName, positions: [] };

    const dealsMap = parseVtbDeals(data);
    const positions: [BrokerReportPosition] = data.Report
        .Tablix6[0]
        .bond_type_Collection[0]
        .bond_type[0]
        .FinInstr_Collection[0]
        .FinInstr
        .map((instrument: any) => {
            const fullName: string = instrument.$.FinInstr;
            let totalPrice = 0;
            let totalQuantity = 0;
            if (dealsMap.get(fullName)) {
                const deals = dealsMap.get(fullName);
                if (deals) {
                    for (const deal of deals) {
                        totalPrice += deal.price * deal.quantity;
                        totalQuantity += deal.quantity;
                    }
                }
            }

            return ({
                name: fullName.split(", ")[0],
                averagePrice: totalPrice / totalQuantity,
                quantity: Number.parseInt(
                    instrument.deal_place_Collection[0]
                        .deal_place[0][`${CHAPTER_POSITIONS}_Collection`][0][CHAPTER_POSITIONS][0]
                        .$.remains_plan,
                    10
                )
            });
        });
    return { accountName, positions };
}
