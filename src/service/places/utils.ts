/**
 * Return a list of binary bits which are included ("on") in the input decimal number
 * @param weight 
 * @param binaryValues 
 * @returns 
 */
export const getBitwiseValue = (weight: number | undefined, binaryValues: number[]): number[] => {
  const val = (weight ?? '').toString().length > 0 ? weight as number : null;
  if (val) {
    return binaryValues
    .filter(e => { 
      return (val & e) > 0;
    });
  }
  return [];
};
