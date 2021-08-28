import React, { useMemo } from "react";
import { Rating } from "semantic-ui-react";
import { DataTableFormatterTypeCellParams } from "../../types/cell";
import { StarFormatterParams } from "../../types/formatter";
import { useDataTableStarFormatterCellContext } from "../../utils/contexts/hooks";
import DataTableBaseCell from "../DataTableBaseCell";

const defaultParams: StarFormatterParams = {
    stars: 5
};

export default function DataTableStarFormatterCell({
    params = defaultParams
}: DataTableFormatterTypeCellParams<StarFormatterParams | undefined>) {
    const { cell } = useDataTableStarFormatterCellContext();

    const {
        stars = 5,
        className
    } = params;

    const formattedStars = useMemo(() => {
        return (
            <Rating
                disabled
                maxRating={stars}
                defaultRating={cell}
                className={className}
            />
        );
    }, [cell, className, stars]);

    return <DataTableBaseCell>{formattedStars}</DataTableBaseCell>;
}
