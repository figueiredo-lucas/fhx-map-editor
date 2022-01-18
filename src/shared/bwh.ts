import { Field } from "./field";
import { Ogg } from "./ogg";

interface LOD {
  lod: number,
  blank: string
}

export interface BWH {
  filename: string,
  size: number,
  header: string,
  version: number,
  height: number,
  width: number,
  corner1: number,
  zero1: number,
  corner2: number,
  corner3: number,
  zero2: number,
  corner4: number,
  blocks: number,
  blockwidth: number,
  blockheight: number,
  unk1: number,
  unk2: number,

  lod: LOD[],

  unk3: number,
  zone: Field[],
  count_music: number,
  music: Ogg[]
}