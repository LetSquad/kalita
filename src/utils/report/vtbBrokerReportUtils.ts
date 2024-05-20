import { BrokerReportData, BrokerReportDeal, BrokerReportPosition } from "../../models/portfolios/types";

const CHAPTER_ACCOUNT_NAME = "Подробности";
const CHAPTER_DEALS = "Подробности9";
const CHAPTER_POSITIONS = "Подробности21";

const BOND_TYPE_STOCK = "АКЦИЯ";
const BOND_TYPE_DEPOSIT_RECEIPT = "Депозитарная расписка";
const BOND_TYPE_UNIT = "ПАЙ";

function parseVtbDeals(data: any): Map<string, BrokerReportDeal[]> {
    const dealsSection = data.Report.Tablix_b9;
    if (!dealsSection || dealsSection.length === 0 || !dealsSection[0][`${CHAPTER_DEALS}_Collection`]) {
        return new Map();
    }

    const deals: BrokerReportDeal[] = dealsSection[0][`${CHAPTER_DEALS}_Collection`][0][CHAPTER_DEALS]
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
        .Tablix_h2_acc[0][`${CHAPTER_ACCOUNT_NAME}_Collection`][0][CHAPTER_ACCOUNT_NAME]
        .find((acc: any) => acc.$)
        .$.AccNum
        .split(" ")[0];
    const accountName = `${brokerName}: ${accountNumber}`;

    const positionsSection = data.Report.Tablix6[0];
    if (positionsSection === null || positionsSection.length === 0) {
        return { accountName, positions: [] };
    }

    const dealsMap = parseVtbDeals(data);
    const positions: BrokerReportPosition[] = [];
    for (const bondType of positionsSection.bond_type_Collection[0].bond_type) {
        const bondTypeName = bondType.bond_type1[0].$.bond_type1;
        if (bondTypeName === BOND_TYPE_STOCK || bondTypeName === BOND_TYPE_DEPOSIT_RECEIPT || bondTypeName === BOND_TYPE_UNIT) {
            for (const instrument of bondType.FinInstr_Collection[0].FinInstr) {
                const fullCode: string = instrument.$.FinInstr;
                let dealsSum = 0;
                let dealsQuantity = 0;
                if (dealsMap.get(fullCode)) {
                    const deals = dealsMap.get(fullCode);
                    if (deals) {
                        for (const deal of deals) {
                            dealsSum += deal.price * deal.quantity;
                            dealsQuantity += deal.quantity;
                        }
                    }
                }

                let quantity = 0;
                for (const dealPlace of instrument.deal_place_Collection[0].deal_place) {
                    quantity += Number.parseInt(
                        dealPlace[`${CHAPTER_POSITIONS}_Collection`][0][CHAPTER_POSITIONS][0].$.remains_plan,
                        10
                    );
                }

                if (quantity !== 0) {
                    positions.push({
                        code: fullCode.split(",")[2].trim(),
                        averagePrice: dealsQuantity === 0 ? 0 : Math.round((dealsSum / dealsQuantity) * 100) / 100,
                        quantity
                    });
                }
            }
        }
    }
    return { accountName, positions };
}
