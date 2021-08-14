import { hslToRgb } from "./hslToRgb";

const getNColors = (count: number) => {
    const simpleColors: number[][] = count > 8
        ? [
            [200, 200, 200],
            [150, 150, 150],
            [70, 70, 70]
        ]
        : [];
    const colors: number[][] = [];
    const colorsLeft: number = count - simpleColors.length;
    for (let i = 0; i < colorsLeft; i++) {
        colors.push(hslToRgb((0.9 * i) / colorsLeft, 1, 0.7));
    }
    return [...colors, ...simpleColors];
};

export default getNColors;
