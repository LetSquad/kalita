import React, { useMemo } from "react";
import { Rating } from "semantic-ui-react";
import { useDataTableStarFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";
import { defaultStarFormatterParams } from "../utils/formatterUtils";

export default function DataTableStarFormatterCell() {
    const {
        cell,
        id,
        column: {
            formatter: {
                params = defaultStarFormatterParams
            },
            edit
        }
    } = useDataTableStarFormatterCellContext();

    const {
        maxStars = 5,
        className
    } = params;

    const editParams = edit?.params;

    const formattedStars = useMemo(() => {
        return (
            <Rating
                disabled={!editParams}
                maxRating={maxStars}
                defaultRating={cell}
                rating={cell}
                className={className}
                onRate={(event, data) =>
                    editParams
                        ? editParams.onCellChange(id, event, data.rating as number)
                        : undefined
                }
            />
        );
    }, [cell, className, editParams, id, maxStars]);

    return <DataTableBaseCell>{formattedStars}</DataTableBaseCell>;
}
