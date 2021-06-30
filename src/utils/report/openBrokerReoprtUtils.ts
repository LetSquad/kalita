import { BrokerReportData, BrokerReportDeal, BrokerReportPosition } from "../../models/table/types";

const SECURITY_TYPE_STOCK = "Акции";

export function parseOpenBrokerStocks(data: any): Map<string, string> {
    const stocksMap = new Map<string, string>();
    for (const security of data.broker_report.spot_portfolio_security_params.item) {
        if (security.$.security_type === SECURITY_TYPE_STOCK) {
            stocksMap.set(security.$.security_grn_code, security.$.ticker);
        }
    }
    return stocksMap;
}

export function parseOpenBrokerDeals(data: any): Map<string, BrokerReportDeal[]> {
    const dealsSection = data.broker_report.spot_main_deals_conclusion.item;
    if (!dealsSection || dealsSection.length === 0) {
        return new Map();
    }

    const deals: BrokerReportDeal[] = dealsSection.map((deal: any) => ({
        code: deal.$.security_grn_code,
        price: Number.parseFloat(deal.$.price),
        quantity: Number.parseInt(deal.$.buy_qnty, 10)
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

export function parseOpenBrokerReport(brokerName: string, data: any): BrokerReportData {
    const accountName = `${brokerName}: ${data.broker_report.$.acc_client_code}`;

    const stocksMap: Map<string, string> = parseOpenBrokerStocks(data);
    const dealsMap: Map<string, BrokerReportDeal[]> = parseOpenBrokerDeals(data);

    const positions: BrokerReportPosition[] = [];
    for (const asset of data.broker_report.spot_assets.item) {
        const isinCode: string = asset.$.asset_code;
        const ticker = stocksMap.get(isinCode);

        if (ticker) {
            let totalPrice = 0;
            let totalQuantity = 0;
            const deals = dealsMap.get(isinCode);
            if (deals) {
                for (const deal of deals) {
                    totalPrice += deal.price * deal.quantity;
                    totalQuantity += deal.quantity;
                }
            }

            positions.push({
                code: ticker,
                averagePrice: Math.round((totalPrice / totalQuantity) * 100) / 100,
                quantity: Number.parseInt(asset.$.closing_position_plan, 10)
            });
        }
    }

    return { accountName, positions };
}
