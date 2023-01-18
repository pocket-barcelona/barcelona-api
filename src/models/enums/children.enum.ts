export enum ChildrenEnum {
  NotSuitable = 1,
  Suitable = 2,
  Recommended = 4,
  SingleParents = 8,
}
export const ChildrenBits: number[] = [
  ChildrenEnum.NotSuitable,
  ChildrenEnum.Suitable,
  ChildrenEnum.Recommended,
  ChildrenEnum.SingleParents,
];
