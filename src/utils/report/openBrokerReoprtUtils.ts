import { BrokerReportData, BrokerReportDeal, BrokerReportPosition } from "../../models/portfolios/types";

const SECURITY_TYPE_STOCK = "Акции";
const SECURITY_TYPE_FUND = "ПАИ";

export function parseOpenBrokerPositions(data: any): Map<string, string> {
    const positionsMap = new Map<string, string>();
    for (const security of data.broker_report.spot_portfolio_security_params[0].item) {
        const securityType: string = security.$.security_type;
        if (securityType === SECURITY_TYPE_STOCK || securityType === SECURITY_TYPE_FUND) {
            positionsMap.set(security.$.security_grn_code, security.$.ticker);
        }
    }
    return positionsMap;
}

export function parseOpenBrokerDeals(data: any): Map<string, BrokerReportDeal[]> {
    if (!data.broker_report.spot_main_deals_conclusion) {
        return new Map();
    }
    const dealsSection = data.broker_report.spot_main_deals_conclusion[0].item;
    if (!dealsSection || dealsSection.length === 0) {
        return new Map();
    }

    const deals: BrokerReportDeal[] = dealsSection.flatMap((deal: any) => {
        if (!deal.$.buy_qnty) {
            return [];
        }
        return {
            code: deal.$.security_grn_code,
            price: Number.parseFloat(deal.$.price),
            quantity: Number.parseInt(deal.$.buy_qnty, 10)
        };
    });
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

export function parseOpenBrokerReport(brokerName: string, data: any): BrokerReportData {
    const accountName = `${brokerName}: ${data.broker_report.$.acc_client_code}`;

    const positionsMap: Map<string, string> = parseOpenBrokerPositions(data);
    const dealsMap: Map<string, BrokerReportDeal[]> = parseOpenBrokerDeals(data);

    const positions: BrokerReportPosition[] = [];
    for (const asset of data.broker_report.spot_assets[0].item) {
        const isinCode: string = asset.$.asset_code;
        const ticker = positionsMap.get(isinCode);

        if (ticker) {
            let dealsSum = 0;
            let dealsQuantity = 0;
            const deals = dealsMap.get(isinCode);
            if (deals) {
                for (const deal of deals) {
                    dealsSum += deal.price * deal.quantity;
                    dealsQuantity += deal.quantity;
                }
            }

            const quantity = Number.parseInt(asset.$.closing_position_plan, 10);
            if (quantity !== 0) {
                positions.push({
                    code: ticker,
                    averagePrice: dealsQuantity === 0 ? 0 : Math.round((dealsSum / dealsQuantity) * 100) / 100,
                    quantity
                });
            }
        }
    }

    return { accountName, positions };
}
