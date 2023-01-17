export enum TimeOfDayEnum {
  Day = 1,
  Night = 2,
  Both = 4,
  /** @deprecated - this makes no sense */
  Weekend = 8,
}
export const TimeOfDayBits: number[] = [
  TimeOfDayEnum.Day,
  TimeOfDayEnum.Night,
  TimeOfDayEnum.Both,
];
