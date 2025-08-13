export enum RequiresBookingEnum {
	No = 1,
	OnArrival = 2,
	SameDay = 4,
	InAdvance = 8,
	SellingFast = 16, // not imp yet
}
export const RequiresBookingBits: number[] = [
	RequiresBookingEnum.No,
	RequiresBookingEnum.OnArrival,
	RequiresBookingEnum.SameDay,
	RequiresBookingEnum.InAdvance,
	// RequiresBookingEnum.SellingFast,
];
