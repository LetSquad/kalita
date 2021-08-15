import { hslToRgb } from "./hslToRgb";

const saturation = 1;
const lightness = 0.7;
const colorPaletteCropFactor = 0.9;
const highlyContrastColorsCount = 8;
const shadesOfGray: [number, number, number][] = [
    // [r, g, b]
    [70, 70, 70],
    [150, 150, 150],
    [200, 200, 200]
];

const getNColors = (count: number): [number, number, number][] => {
    const colors: [number, number, number][] = [];
    const colorsLeft: number = count > highlyContrastColorsCount ? count - shadesOfGray.length : count;
    for (let i = 0; i < colorsLeft; i++) {
        colors.push(hslToRgb((colorPaletteCropFactor * i) / colorsLeft, saturation, lightness));
    }
    if (count > highlyContrastColorsCount) {
        colors.push(...shadesOfGray);
    }
    return colors;
};

export default getNColors;
