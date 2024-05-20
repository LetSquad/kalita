export function parseMoney(value: string): number {
    return Number.parseFloat(Number.parseFloat(value.replace(",", ".")).toFixed(5));
}
