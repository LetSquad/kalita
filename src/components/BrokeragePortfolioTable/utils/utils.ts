export function generateExportList(list: any[]) {
    let updatedList: any[] = [];

    const groupsIndexes: number[] = list.map((row, id) => (row.type === "group"
        ? id
        : undefined))
        .filter((index) => index !== undefined) as number[];

    if (groupsIndexes.length > 0) {
        const header = list[0];
        const columnsToRemove = new Set(header.columns
            .map((data: any, id: number) => (data.value === undefined
                ? id
                : undefined))
            .filter((index: number) => index !== undefined));
        header.columns = [
            ...header.columns,
            {
                component: null,
                depth: 1,
                height: 1,
                value: "Группа",
                width: 1
            }
        ].filter((data, _id) => !columnsToRemove.has(_id));
        updatedList = [list[0]];
        for (const [id, groupId] of groupsIndexes.entries()) {
            const group = list[groupId];
            const startIndex: number = groupId + 1;
            const endIndex = groupsIndexes[id + 1]
                ? groupsIndexes[id + 1]
                : list.length;

            for (let i = startIndex; i < endIndex; i++) {
                const row = list[i];
                row.columns = [...row.columns.filter((data: any, _id: number) => !columnsToRemove.has(_id)), group.columns[0]];
                updatedList = [...updatedList, row];
            }
        }

        return updatedList;
    }

    return list;
}

export function generateCsv(list: any[], options?: { delimiter: "." | ",", bom?: boolean }) {
    const delimiter = options && options.delimiter
        ? options.delimiter
        : ",";
    let fileContents: string[] | string = [];
    const headers: string[] = [];

    for (const row of list) {
        const item: string[] = [];

        switch (row.type) {
            case "header":
                for (const [i, col] of row.columns.entries()) {
                    if (col && col.depth === 1) {
                        headers[i] = typeof col.value === "undefined" || col.value === null
                            ? ""
                            : (`"${String(col.value)
                                .split("\"")
                                .join("\"\"")}"`);
                    }
                }
                break;
            case "row":
                for (const col of row.columns) {
                    if (col) {
                        switch (typeof col.value) {
                            case "object": {
                                col.value = JSON.stringify(col.value);
                                break;
                            }
                            case "undefined": {
                                col.value = "";
                                break;
                            }
                            default:
                                break;
                        }

                        item.push(`"${String(col.value)
                            .split("\"")
                            .join("\"\"")}"`);
                    }
                }

                fileContents.push(item.join(delimiter));
                break;
            default:
                break;
        }
    }

    if (headers.length > 0) {
        fileContents.unshift(headers.join(delimiter));
    }

    fileContents = fileContents.join("\n");

    if (options && options.bom) {
        fileContents = `\uFEFF${fileContents}`;
    }

    return fileContents;
}
