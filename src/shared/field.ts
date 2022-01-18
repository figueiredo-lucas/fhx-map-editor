import { ColorCount, RGB } from "./rgb";

interface Dist {
  min: number,
  max: number
}

export interface ColorsByProp {
  day_fog: ColorCount[],
  night_fog: ColorCount[],
  original_heaven: ColorCount[],
  night_heaven: ColorCount[],
  day_heaven: ColorCount[]
}

export interface Field {
  name: string,
  is_active: number,
  unk: string,
  day_fog: RGB,
  day_fog_dist: Dist,
  night_fog: RGB,
  night_fog_dist: Dist,
  original_heaven: RGB,
  night_heaven: RGB,
  day_heaven: RGB
};