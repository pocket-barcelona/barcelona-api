import { type calendar_v3, google } from "googleapis";

const event: calendar_v3.Schema$Event = {
	summary: "Mecal Air Barcelona (Open Air Cinema)",
	location: "Museo Can Framis",
	description:
		"🎤 Type: Music / Film Festival\n" +
		"\n" +
		"🔗 URL: https://www.mecalbcn.org/mecal-air\n" +
		"\n" +
		"📆 Start: Fri Jul 12 2024.\n" +
		"End: Fri Jul 12 2024\n" +
		"\n" +
		"📍 Location: https://www.google.com/maps/search/?query=41.402893,2.194985&api=1\n" +
		"\n" +
		"📝 Notes: The sessions start at 20:00h\n",
	start: { date: "2024-07-12", timeZone: "Europe/Madrid" },
	end: { date: "2024-07-13", timeZone: "Europe/Madrid" },
	guestsCanInviteOthers: false,
	guestsCanModify: false,
	guestsCanSeeOtherGuests: false,
	iCalUID: "0a0da759-f18e-4547-a5cf-04120872921a",
	recurrence: ["RRULE:FREQ=WEEKLY;COUNT=9"],
	id: "_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4_20240712",
};

// Instances: https://developers.google.com/calendar/api/guides/recurringevents#accessing_instances
// like parent event, but without recurrence field
const instances: calendar_v3.Schema$Event[] = [
	{
		kind: "calendar#event",
		etag: '"3448646585398000"',
		id: "_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4_20240802",
		status: "confirmed",
		htmlLink:
			"https://www.google.com/calendar/event?eid=XzYxZ2owcDMxNnNxamliYjY2NHM2YWI5azZrcTNlYmIxNmxobWNiOWc2Z29qNGMxbzZzcDNpY2hoYzRfMjAyNDA4MDIgY18zYzY5YzExYjZkNjk3NTY5NzQxOGUxZjkyOGE2ZmVmMjBmMGJiNDIwMmIzNDBiYjNmOTEzMDQyNWIyNDFkZTFkQGc",
		created: "2024-08-09T10:44:11.000Z",
		updated: "2024-08-22T10:41:32.699Z",
		summary: "Mecal Air Barcelona (Open Air Cinema)",
		description:
			"🎤 Type: Music / Film Festival\n🔗 URL: https://www.mecalbcn.org/mecal-air\n📍 Location: https://maps.google.com/?q=41.402893,2.194985,16z\n\n📝 Notes: The sessions start at 20:00h\nNote: This event spans multiple days. 📆 Start: Fri Jul 12 2024",
		location: "Museo Can Framis",
		creator: {
			email: "yo@darryloctober.co.uk",
			displayName: "Darryl October",
		},
		organizer: {
			email:
				"c_3c69c11b6d6975697418e1f928a6fef20f0bb4202b340bb3f9130425b241de1d@group.calendar.google.com",
			displayName: "Pocket Barcelona",
			self: true,
		},
		start: {
			date: "2024-08-02",
		},
		end: {
			date: "2024-08-03",
		},
		recurringEventId:
			"_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4",
		originalStartTime: {
			date: "2024-08-02",
		},
		iCalUID: "0a0da759-f18e-4547-a5cf-04120872921a",
		sequence: 0,
		guestsCanInviteOthers: false,
		guestsCanSeeOtherGuests: false,
		reminders: {
			useDefault: false,
		},
		eventType: "default",
	},
	{
		kind: "calendar#event",
		etag: '"3448646585398000"',
		id: "_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4_20240809",
		status: "confirmed",
		htmlLink:
			"https://www.google.com/calendar/event?eid=XzYxZ2owcDMxNnNxamliYjY2NHM2YWI5azZrcTNlYmIxNmxobWNiOWc2Z29qNGMxbzZzcDNpY2hoYzRfMjAyNDA4MDkgY18zYzY5YzExYjZkNjk3NTY5NzQxOGUxZjkyOGE2ZmVmMjBmMGJiNDIwMmIzNDBiYjNmOTEzMDQyNWIyNDFkZTFkQGc",
		created: "2024-08-09T10:44:11.000Z",
		updated: "2024-08-22T10:41:32.699Z",
		summary: "Mecal Air Barcelona (Open Air Cinema)",
		description:
			"🎤 Type: Music / Film Festival\n🔗 URL: https://www.mecalbcn.org/mecal-air\n📍 Location: https://maps.google.com/?q=41.402893,2.194985,16z\n\n📝 Notes: The sessions start at 20:00h\nNote: This event spans multiple days. 📆 Start: Fri Jul 12 2024",
		location: "Museo Can Framis",
		creator: {
			email: "yo@darryloctober.co.uk",
			displayName: "Darryl October",
		},
		organizer: {
			email:
				"c_3c69c11b6d6975697418e1f928a6fef20f0bb4202b340bb3f9130425b241de1d@group.calendar.google.com",
			displayName: "Pocket Barcelona",
			self: true,
		},
		start: {
			date: "2024-08-09",
		},
		end: {
			date: "2024-08-10",
		},
		recurringEventId:
			"_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4",
		originalStartTime: {
			date: "2024-08-09",
		},
		iCalUID: "0a0da759-f18e-4547-a5cf-04120872921a",
		sequence: 0,
		guestsCanInviteOthers: false,
		guestsCanSeeOtherGuests: false,
		reminders: {
			useDefault: false,
		},
		eventType: "default",
	},
	{
		kind: "calendar#event",
		etag: '"3448646585398000"',
		id: "_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4_20240816",
		status: "confirmed",
		htmlLink:
			"https://www.google.com/calendar/event?eid=XzYxZ2owcDMxNnNxamliYjY2NHM2YWI5azZrcTNlYmIxNmxobWNiOWc2Z29qNGMxbzZzcDNpY2hoYzRfMjAyNDA4MTYgY18zYzY5YzExYjZkNjk3NTY5NzQxOGUxZjkyOGE2ZmVmMjBmMGJiNDIwMmIzNDBiYjNmOTEzMDQyNWIyNDFkZTFkQGc",
		created: "2024-08-09T10:44:11.000Z",
		updated: "2024-08-22T10:41:32.699Z",
		summary: "Mecal Air Barcelona (Open Air Cinema)",
		description:
			"🎤 Type: Music / Film Festival\n🔗 URL: https://www.mecalbcn.org/mecal-air\n📍 Location: https://maps.google.com/?q=41.402893,2.194985,16z\n\n📝 Notes: The sessions start at 20:00h\nNote: This event spans multiple days. 📆 Start: Fri Jul 12 2024",
		location: "Museo Can Framis",
		creator: {
			email: "yo@darryloctober.co.uk",
			displayName: "Darryl October",
		},
		organizer: {
			email:
				"c_3c69c11b6d6975697418e1f928a6fef20f0bb4202b340bb3f9130425b241de1d@group.calendar.google.com",
			displayName: "Pocket Barcelona",
			self: true,
		},
		start: {
			date: "2024-08-16",
		},
		end: {
			date: "2024-08-17",
		},
		recurringEventId:
			"_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4",
		originalStartTime: {
			date: "2024-08-16",
		},
		iCalUID: "0a0da759-f18e-4547-a5cf-04120872921a",
		sequence: 0,
		guestsCanInviteOthers: false,
		guestsCanSeeOtherGuests: false,
		reminders: {
			useDefault: false,
		},
		eventType: "default",
	},
	{
		kind: "calendar#event",
		etag: '"3448646585398000"',
		id: "_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4_20240823",
		status: "confirmed",
		htmlLink:
			"https://www.google.com/calendar/event?eid=XzYxZ2owcDMxNnNxamliYjY2NHM2YWI5azZrcTNlYmIxNmxobWNiOWc2Z29qNGMxbzZzcDNpY2hoYzRfMjAyNDA4MjMgY18zYzY5YzExYjZkNjk3NTY5NzQxOGUxZjkyOGE2ZmVmMjBmMGJiNDIwMmIzNDBiYjNmOTEzMDQyNWIyNDFkZTFkQGc",
		created: "2024-08-09T10:44:11.000Z",
		updated: "2024-08-22T10:41:32.699Z",
		summary: "Mecal Air Barcelona (Open Air Cinema)",
		description:
			"🎤 Type: Music / Film Festival\n🔗 URL: https://www.mecalbcn.org/mecal-air\n📍 Location: https://maps.google.com/?q=41.402893,2.194985,16z\n\n📝 Notes: The sessions start at 20:00h\nNote: This event spans multiple days. 📆 Start: Fri Jul 12 2024",
		location: "Museo Can Framis",
		creator: {
			email: "yo@darryloctober.co.uk",
			displayName: "Darryl October",
		},
		organizer: {
			email:
				"c_3c69c11b6d6975697418e1f928a6fef20f0bb4202b340bb3f9130425b241de1d@group.calendar.google.com",
			displayName: "Pocket Barcelona",
			self: true,
		},
		start: {
			date: "2024-08-23",
		},
		end: {
			date: "2024-08-24",
		},
		recurringEventId:
			"_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4",
		originalStartTime: {
			date: "2024-08-23",
		},
		iCalUID: "0a0da759-f18e-4547-a5cf-04120872921a",
		sequence: 0,
		guestsCanInviteOthers: false,
		guestsCanSeeOtherGuests: false,
		reminders: {
			useDefault: false,
		},
		eventType: "default",
	},
	{
		kind: "calendar#event",
		etag: '"3448646585398000"',
		id: "_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4_20240830",
		status: "confirmed",
		htmlLink:
			"https://www.google.com/calendar/event?eid=XzYxZ2owcDMxNnNxamliYjY2NHM2YWI5azZrcTNlYmIxNmxobWNiOWc2Z29qNGMxbzZzcDNpY2hoYzRfMjAyNDA4MzAgY18zYzY5YzExYjZkNjk3NTY5NzQxOGUxZjkyOGE2ZmVmMjBmMGJiNDIwMmIzNDBiYjNmOTEzMDQyNWIyNDFkZTFkQGc",
		created: "2024-08-09T10:44:11.000Z",
		updated: "2024-08-22T10:41:32.699Z",
		summary: "Mecal Air Barcelona (Open Air Cinema)",
		description:
			"🎤 Type: Music / Film Festival\n🔗 URL: https://www.mecalbcn.org/mecal-air\n📍 Location: https://maps.google.com/?q=41.402893,2.194985,16z\n\n📝 Notes: The sessions start at 20:00h\nNote: This event spans multiple days. 📆 Start: Fri Jul 12 2024",
		location: "Museo Can Framis",
		creator: {
			email: "yo@darryloctober.co.uk",
			displayName: "Darryl October",
		},
		organizer: {
			email:
				"c_3c69c11b6d6975697418e1f928a6fef20f0bb4202b340bb3f9130425b241de1d@group.calendar.google.com",
			displayName: "Pocket Barcelona",
			self: true,
		},
		start: {
			date: "2024-08-30",
		},
		end: {
			date: "2024-08-31",
		},
		recurringEventId:
			"_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4",
		originalStartTime: {
			date: "2024-08-30",
		},
		iCalUID: "0a0da759-f18e-4547-a5cf-04120872921a",
		sequence: 0,
		guestsCanInviteOthers: false,
		guestsCanSeeOtherGuests: false,
		reminders: {
			useDefault: false,
		},
		eventType: "default",
	},
	{
		kind: "calendar#event",
		etag: '"3448646585398000"',
		id: "_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4_20240906",
		status: "confirmed",
		htmlLink:
			"https://www.google.com/calendar/event?eid=XzYxZ2owcDMxNnNxamliYjY2NHM2YWI5azZrcTNlYmIxNmxobWNiOWc2Z29qNGMxbzZzcDNpY2hoYzRfMjAyNDA5MDYgY18zYzY5YzExYjZkNjk3NTY5NzQxOGUxZjkyOGE2ZmVmMjBmMGJiNDIwMmIzNDBiYjNmOTEzMDQyNWIyNDFkZTFkQGc",
		created: "2024-08-09T10:44:11.000Z",
		updated: "2024-08-22T10:41:32.699Z",
		summary: "Mecal Air Barcelona (Open Air Cinema)",
		description:
			"🎤 Type: Music / Film Festival\n🔗 URL: https://www.mecalbcn.org/mecal-air\n📍 Location: https://maps.google.com/?q=41.402893,2.194985,16z\n\n📝 Notes: The sessions start at 20:00h\nNote: This event spans multiple days. 📆 Start: Fri Jul 12 2024",
		location: "Museo Can Framis",
		creator: {
			email: "yo@darryloctober.co.uk",
			displayName: "Darryl October",
		},
		organizer: {
			email:
				"c_3c69c11b6d6975697418e1f928a6fef20f0bb4202b340bb3f9130425b241de1d@group.calendar.google.com",
			displayName: "Pocket Barcelona",
			self: true,
		},
		start: {
			date: "2024-09-06",
		},
		end: {
			date: "2024-09-07",
		},
		recurringEventId:
			"_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4",
		originalStartTime: {
			date: "2024-09-06",
		},
		iCalUID: "0a0da759-f18e-4547-a5cf-04120872921a",
		sequence: 0,
		guestsCanInviteOthers: false,
		guestsCanSeeOtherGuests: false,
		reminders: {
			useDefault: false,
		},
		eventType: "default",
	},
	{
		kind: "calendar#event",
		etag: '"3448576451293000"',
		id: "_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4_20240712",
		status: "confirmed",
		htmlLink:
			"https://www.google.com/calendar/event?eid=XzYxZ2owcDMxNnNxamliYjY2NHM2YWI5azZrcTNlYmIxNmxobWNiOWc2Z29qNGMxbzZzcDNpY2hoYzRfMjAyNDA3MTIgY18zYzY5YzExYjZkNjk3NTY5NzQxOGUxZjkyOGE2ZmVmMjBmMGJiNDIwMmIzNDBiYjNmOTEzMDQyNWIyNDFkZTFkQGc",
		created: "2024-08-09T10:44:11.000Z",
		updated: "2024-08-22T10:41:32.699Z",
		summary: "Mecal Air Barcelona (Open Air Cinema)",
		description:
			"🎤 Type: Music / Film Festival\n🔗 URL: https://www.mecalbcn.org/mecal-air\n📍 Location: https://maps.google.com/?q=41.402893,2.194985,16z\n\n📝 Notes: The sessions start at 20:00h\nNote: This event spans multiple days. 📆 Start: Fri Jul 12 2024",
		location: "Museo Can Framis",
		creator: {
			email: "yo@darryloctober.co.uk",
			displayName: "Darryl October",
		},
		organizer: {
			email:
				"c_3c69c11b6d6975697418e1f928a6fef20f0bb4202b340bb3f9130425b241de1d@group.calendar.google.com",
			displayName: "Pocket Barcelona",
			self: true,
		},
		start: {
			date: "2024-07-19",
		},
		end: {
			date: "2024-07-20",
		},
		recurringEventId:
			"_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4",
		originalStartTime: {
			date: "2024-07-12",
		},
		iCalUID: "0a0da759-f18e-4547-a5cf-04120872921a",
		sequence: 1,
		guestsCanInviteOthers: false,
		guestsCanSeeOtherGuests: false,
		reminders: {
			useDefault: false,
		},
		eventType: "default",
	},
	{
		kind: "calendar#event",
		etag: '"3448646585398000"',
		id: "_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4_20240726",
		status: "confirmed",
		htmlLink:
			"https://www.google.com/calendar/event?eid=XzYxZ2owcDMxNnNxamliYjY2NHM2YWI5azZrcTNlYmIxNmxobWNiOWc2Z29qNGMxbzZzcDNpY2hoYzRfMjAyNDA3MjYgY18zYzY5YzExYjZkNjk3NTY5NzQxOGUxZjkyOGE2ZmVmMjBmMGJiNDIwMmIzNDBiYjNmOTEzMDQyNWIyNDFkZTFkQGc",
		created: "2024-08-09T10:44:11.000Z",
		updated: "2024-08-22T10:41:32.699Z",
		summary: "Mecal Air Barcelona (Open Air Cinema)",
		description:
			"🎤 Type: Music / Film Festival\n\n🔗 URL: https://www.mecalbcn.org/mecal-air\n\n📆 Start: Fri Jul 12 2024.\nEnd: Fri Jul 12 2024\n\n📍 Location: https://www.google.com/maps/search/?query=41.402893,2.194985&api=1\n\n📝 Notes: The sessions start at 20:00h\n",
		location: "Museo Can Framis",
		creator: {
			email: "yo@darryloctober.co.uk",
			displayName: "Darryl October",
		},
		organizer: {
			email:
				"c_3c69c11b6d6975697418e1f928a6fef20f0bb4202b340bb3f9130425b241de1d@group.calendar.google.com",
			displayName: "Pocket Barcelona",
			self: true,
		},
		start: {
			date: "2024-07-26",
		},
		end: {
			date: "2024-07-27",
		},
		recurringEventId:
			"_61gj0p316sqjibb664s6ab9k6kq3ebb16lhmcb9g6goj4c1o6sp3ichhc4",
		originalStartTime: {
			date: "2024-07-26",
		},
		iCalUID: "0a0da759-f18e-4547-a5cf-04120872921a",
		sequence: 0,
		guestsCanInviteOthers: false,
		guestsCanSeeOtherGuests: false,
		reminders: {
			useDefault: false,
		},
		eventType: "default",
	},
];
