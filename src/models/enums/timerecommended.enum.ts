export enum TimeRecommendedEnum {
  CoupleOfHours = 1,  
  QuarterDay = 2,
  HalfDay = 4,
  FullDay = 8,
  Weekend = 16, // or 2 days
  More = 32 // 4 days or more
}
export const TimeRecommendedBits: number[] = [
  TimeRecommendedEnum.CoupleOfHours,
  TimeRecommendedEnum.QuarterDay,
  TimeRecommendedEnum.HalfDay,
  TimeRecommendedEnum.FullDay,
  TimeRecommendedEnum.Weekend,
  TimeRecommendedEnum.More
];