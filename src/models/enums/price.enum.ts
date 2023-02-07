export enum PriceEnum {
  Free = 1, // Free!
  VeryCheap = 2, // €0 - €5
  Cheap = 4, // €5 - €10
  ModeratePrice = 8, // €10 - €25
  QuiteExpensive = 16, // €25 - €50
  VeryExpensive = 32, // €50+
}
export const PriceBits: number[] = [
  PriceEnum.Free,
  PriceEnum.VeryCheap,
  PriceEnum.Cheap,
  PriceEnum.ModeratePrice,
  PriceEnum.QuiteExpensive,
  PriceEnum.VeryExpensive,
];
