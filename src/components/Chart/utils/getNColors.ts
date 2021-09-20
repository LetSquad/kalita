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

export function getNColors(count: number): [number, number, number][] {
    const colors: [number, number, number][] = [];
    const colorsLeft: number = count > highlyContrastColorsCount ? count - shadesOfGray.length : count;
    for (let i = 0; i < colorsLeft; i++) {
        const hue: number = (colorPaletteCropFactor * i) / colorsLeft;
        colors.push(hslToRgb(hue, saturation, lightness));
    }
    if (count > highlyContrastColorsCount) {
        colors.push(...shadesOfGray);
    }
    return colors;
}

/*
 * Converts an HSL color value to RGB. Conversion formula
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @return  Array   The RGB representation
 * @param   h       The hue
 * @param   s       The saturation
 * @param   l       The lightness
 */
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r;
    let g;
    let b;

    if (s === 0) {
        r = l;
        g = l;
        b = l;
    } else {
        const q = l < 0.5
            ? l * (1 + s)
            : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
};

const hue2rgb = (p: number, q: number, _t: number) => {
    let t = _t;
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
};
