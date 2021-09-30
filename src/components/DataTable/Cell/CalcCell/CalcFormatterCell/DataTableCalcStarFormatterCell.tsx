import React, { useMemo } from "react";
import { Rating } from "semantic-ui-react";
import { useDataTableCalcStarFormatterCellContext } from "../../../utils/contexts/hooks";
import { defaultStarFormatterParams } from "../../utils/formatterUtils";
import DataTableBaseCalcCell from "../DataTableBaseCalcCell";

export default function DataTableCalcStarFormatterCell() {
    const {
        cell,
        formatter: {
            params = defaultStarFormatterParams
        }
    } = useDataTableCalcStarFormatterCellContext();

    const {
        maxStars = 5,
        className
    } = params;

    const formattedStars = useMemo(() => (
        <Rating
            disabled
            maxRating={maxStars}
            defaultRating={cell}
            rating={cell}
            className={className}
        />
    ), [cell, className, maxStars]);

    return <DataTableBaseCalcCell>{formattedStars}</DataTableBaseCalcCell>;
}
