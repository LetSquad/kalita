import { DataTableData } from "../types/base";
import { GroupData } from "../types/group";

export function groupData(
    list: DataTableData[],
    field: keyof DataTableData
): GroupData[] {
    const groups: GroupData[] = [];
    for (const item of list) {
        const groupName = String(item[field]);
        const groupIndex = groups.findIndex(({ name }) => name === groupName);
        if (groupIndex === -1) {
            groups.push({
                name: groupName,
                data: [item]
            } as GroupData);
        } else {
            groups[groupIndex].data.push(item);
        }
    }
    return groups;
}
