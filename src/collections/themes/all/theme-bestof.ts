import { CategoryIdEnum } from '../../../models/enums/categoryid.enum.js';
import { RequiresBookingEnum } from '../../../models/enums/requiresbooking.enum.js';
import { TimeRecommendedEnum } from '../../../models/enums/timerecommended.enum.js';
import { TimeOfDayEnum } from '../../../models/enums/tod.enum.js';
import { PlanThemeEnum, type StructuredPlanDayProfile } from '../../../models/planThemes.js';
import { CENTRAL_BARRIO_IDS } from './theme-category.js';

const themes: StructuredPlanDayProfile[] = [
	{
		id: 401,
		theme: PlanThemeEnum.BestOf,
		themeTod: TimeOfDayEnum.Day,
		name: 'Best of El Gotico',
		popular: true,
		barrioIds: [12],
		timeRecommendedOptions: [TimeRecommendedEnum.CoupleOfHours, TimeRecommendedEnum.HalfDay],
		requiresBookingOptions: [RequiresBookingEnum.No, RequiresBookingEnum.OnArrival],
		limit: 15,
		orderBy: [
			{
				key: 'lng',
				direction: 'ASC',
			},
		],
	},
	{
		id: 402,
		theme: PlanThemeEnum.BestOf, // @todo change?
		themeTod: TimeOfDayEnum.Day,
		name: 'Get sporty in Barcelona',
		categoryIds: [12],
		placeIds: [36, 37, 6, 285, 158, 290],
		placeIdsChooseAmount: 3,
		daytrip: 0,
		limit: 4,
	},

	{
		id: 403,
		theme: PlanThemeEnum.BestOf,
		themeTod: TimeOfDayEnum.Night,
		name: 'Enjoy the Old Town by night',
		popular: true,
		barrioIds: [...CENTRAL_BARRIO_IDS],
		categoryIds: [CategoryIdEnum.Plazas],
		bestTod: TimeOfDayEnum.Night,
		// timeRecommendedOptions: [
		//   TimeRecommendedEnum.CoupleOfHours,
		//   TimeRecommendedEnum.HalfDay,
		// ],
		requiresBookingOptions: [RequiresBookingEnum.No, RequiresBookingEnum.OnArrival],
		limit: 3,
		orderBy: [
			{
				key: 'lng',
				direction: 'DESC',
			},
		],
	},
	{
		id: 404,
		theme: PlanThemeEnum.BestOf,
		themeTod: TimeOfDayEnum.Night,
		name: 'El Born by night',
		// popular: true,
		barrioIds: [13],
		categoryIds: [CategoryIdEnum.BarsRestaurants, CategoryIdEnum.Plazas],
		bestTod: TimeOfDayEnum.Night,
		// timeRecommendedOptions: [
		//   TimeRecommendedEnum.CoupleOfHours,
		//   TimeRecommendedEnum.HalfDay,
		// ],
		requiresBookingOptions: [RequiresBookingEnum.No, RequiresBookingEnum.OnArrival],
		limit: 5,
		orderBy: [
			{
				key: 'lng',
				direction: 'DESC',
			},
		],
	},
	{
		id: 405,
		theme: PlanThemeEnum.BestOf,
		themeTod: TimeOfDayEnum.Night,
		name: 'El Gótico by night',
		// popular: true,
		barrioIds: [12],
		categoryIds: [CategoryIdEnum.BarsRestaurants, CategoryIdEnum.Plazas],
		bestTod: TimeOfDayEnum.Night,
		// timeRecommendedOptions: [
		//   TimeRecommendedEnum.CoupleOfHours,
		//   TimeRecommendedEnum.HalfDay,
		// ],
		requiresBookingOptions: [RequiresBookingEnum.No, RequiresBookingEnum.OnArrival],
		limit: 5,
		orderBy: [
			{
				key: 'lng',
				direction: 'DESC',
			},
		],
	},
	{
		id: 406,
		theme: PlanThemeEnum.BestOf,
		themeTod: TimeOfDayEnum.Night,
		name: 'Barceloneta by night',
		// popular: true,
		barrioIds: [14],
		categoryIds: [
			CategoryIdEnum.BarsRestaurants,
			CategoryIdEnum.Plazas,
			CategoryIdEnum.Experiences,
			CategoryIdEnum.Beaches,
		],
		bestTod: TimeOfDayEnum.Night,
		// timeRecommendedOptions: [
		//   TimeRecommendedEnum.CoupleOfHours,
		//   TimeRecommendedEnum.HalfDay,
		// ],
		requiresBookingOptions: [RequiresBookingEnum.No, RequiresBookingEnum.OnArrival],
		limit: 5,
		orderBy: [
			{
				key: 'lng',
				direction: 'DESC',
			},
		],
	},
	{
		id: 407,
		theme: PlanThemeEnum.BestOf,
		themeTod: TimeOfDayEnum.Night,
		name: 'Eixample Neighbourhood by night',
		// popular: true,
		barrioIds: [15, 16, 17],
		categoryIds: [
			CategoryIdEnum.BarsRestaurants,
			CategoryIdEnum.Plazas,
			CategoryIdEnum.Experiences,
			CategoryIdEnum.Beaches,
		],
		bestTod: TimeOfDayEnum.Night,
		// timeRecommendedOptions: [
		//   TimeRecommendedEnum.CoupleOfHours,
		//   TimeRecommendedEnum.HalfDay,
		// ],
		requiresBookingOptions: [RequiresBookingEnum.No, RequiresBookingEnum.OnArrival],
		limit: 5,
		orderBy: [
			{
				key: 'lng',
				direction: 'DESC',
			},
		],
	},
];
export default themes;
