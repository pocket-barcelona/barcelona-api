# Endpoints:

# GET

Events (latest, all)
Event (by ID)

# POST

- Create event
- Hide /delete event
- RSVP to an event (set as going, not going)
- Subscribe to an event (get updates)
- Generate event QR code (UI allow revolut style QR customisation)
- Generate event invite link (with expiry date or max use)
- Read event QR code (convert back to original form data or shows user status of event and what they have)
- Create event promo code
- Create event voucher (e.g. 20% off drinks)
- Issue voucher to user segment
- Sync event to Google calendar? (app would require Google calendar API key and calendar URL)

# PATCH
- (Group owner) Edit event
- Edit RSVP
- Edit user data

---

# Create event (admin)

## Form fields

- UUID (auto)
- Cloned from UUID
- Event status: Draft / Live but TBC location / Live
- Event privacy (1=public,2=location only visible to people going, 3=hidden)
- Requires YES or not, or can support maybe?
- Event title
- Event subtitle
- Event description
- Type:
  - meetup/social/drinks
  - music/gig/live band etc
  -
- Sub type: TBD: e.g.
  - city/culture: city walk, wine tasting
  - social/friends: board games, dinner / drinks
  - language exchange
  - sporting event, e.g. yoga meetup, volleyball, bowling
  - dating: speed dating, flirting
  - specialist: munch etc
- Mode: in-person, online, hybrid
- Start time
- End time
- Location fields: Address etc
- Lat/lng
- Show exact location on map: 1=yes,2=show radius,3=show city only,4=hide location
- Google maps URL
- how to find us?
- Price, entry fee
- Min number of people?
- Max number of people?
- Topics & event tags
- Event Hosts: User[]
- Event photos (first featured)
- Event promo codes (acts on the price only) (ex: 10% off entry)
- Event vouchers: (takes effect during the event) (ex: 10% off drinks during the event)

---

# RSVP to an event:

## Form fields

- Name / Nickname
- Last name (optional)
- Email
- Telegram
  - Username
  - Number
- Whatsapp phone number
- Mobile Phone number
- NIE / DNI / TIE
- Social profile
  - Other profile URL
  - Other username

---

# Event login / auth

## Login with:

- Instagram
- Facebook
- Google
- Email/Pass

---

At event:

1. User scans main event QR from admin and logs in (same as when they RSVP'd)
2. Admin can then scan their QR code to give them a voucher or mark them as having attended, mark them as paid by cash etc
