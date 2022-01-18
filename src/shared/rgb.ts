export interface RGB {
  r: number,
  g: number,
  b: number
}

export interface ColorCount extends RGB {
  uniqueKey: number;
  count: number
}