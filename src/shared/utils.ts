import { BWH } from "./bwh";
import { ColorCount, RGB } from "./rgb";

export const convertRGBFloatToDec = (color: RGB): RGB =>
  Object.keys(color).reduce((acc: RGB, curr: string) =>
    ({ ...acc, [curr]: Math.round(color[curr as keyof RGB] * 255) })
    , {} as RGB);

export const convertRGBDecToFloat = (color: RGB): RGB =>
  Object.keys(color).filter(k => ['r', 'g', 'b'].includes(k)).reduce((acc: RGB, curr: string) =>
    ({ ...acc, [curr]: color[curr as keyof RGB] / 255 })
    , {} as RGB);

export const getRGBKey = (color: RGB): number => {
  return color.r + color.g + color.b;
}

export const rgbToHex = (color: RGB): string =>
  `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`

export const getColorsFromZones = (map: BWH | undefined, expectedProp: string): ColorCount[] => {
  if (map) {
    return map.zone
      // @ts-ignore
      .map(z => convertRGBFloatToDec(z[expectedProp]))
      .reduce((acc, curr) => {
        const foundColor = acc.find((c) => c.r === curr.r && c.g === curr.g && c.b === curr.b);
        if (foundColor) {
          foundColor.count++;
        } else {
          acc.push({ uniqueKey: curr.r + curr.g + curr.b, ...curr, count: 1 });
        }
        return acc;
      }, [] as ColorCount[])
      .sort((a, b) => b.count - a.count)
  }
  return [];
}