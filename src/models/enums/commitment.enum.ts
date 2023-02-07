export enum CommitmentEnum {
  Casual = 1,
  Easy = 2,
  Medium = 4,
  Hard = 8,
  Extreme = 16
}
export const CommitmentBits: number[] = [
  CommitmentEnum.Casual,
  CommitmentEnum.Easy,
  CommitmentEnum.Medium,
  CommitmentEnum.Hard,
  CommitmentEnum.Extreme,
]