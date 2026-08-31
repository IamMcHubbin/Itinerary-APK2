import type { Trip } from "../types";

// Trip dates: Mon 14 Sep - Sun 27 Sep 2026. Arrival is Monday 14 Sep, no
// separate travel day before it (JL42 departs Heathrow Sun 13 09:10 BST,
// lands Haneda Mon 14 06:45 JST -- Day 1 is the arrival day). Tokyo is
// confirmed at 4 nights (14/15/16/17 Sep) -- matching the original
// 13-night booking, which always had Tokyo at 4; earlier drafts only had
// 3 nights of Tokyo content, so Day 4 is a genuine still-open 4th Tokyo
// night rather than detailed plans. Then Hakone (Day 5, 1 night, Tozan
// railway/cable car/ropeway -- no car rentals), Kyoto (Days 6-8, 3
// nights, still being planned), Osaka (Days 9-11, 3 nights, still being
// planned), Yoshino (Day 12, 1 night), a final Tokyo night (Day 13), then
// the real, already-booked return flight JL7121 (Haneda -> Heathrow,
// Sun 27, Day 14). Total: 13 nights / 14 days, matching the original
// booking -- no bridging placeholder needed any more.
export const trip: Trip = {
  title: "Japan",
  subtitle: "Tokyo · Hakone · Kyoto · Osaka · Yoshino",
  startDate: "2026-09-14",
  endDate: "2026-09-27",
  coverEmoji: "⛩️",
  budgetParticipants: ["Tim", "Jamie"],
  days: [
    {
      id: "day-1",
      date: "2026-09-14",
      city: "Tokyo",
      region: "Arrival, Shibuya & Shinjuku",
      summary: "Land, Shibuya, cat cafe, easy dinner — Golden Gai if upright",
      notes: [
        "Skip Shibuya Sky — paid observation deck, redundant with Skytree (Day 2).",
        "Golden Gai: an otoshi seating charge of ¥500-1,500pp is automatic and normal, not a scam. No photography of alleys/exteriors/people. Some bars are regulars-only and say so — move on. Cash.",
      ],
      activities: [
        {
          id: "d1-1",
          time: "06:45",
          title: "Land at Haneda — JL42",
          category: "transport",
          location: "Haneda Airport",
          description: "Realistically clear immigration and baggage by ~08:15.",
        },
        {
          id: "d1-2",
          time: "09:45",
          title: "Shinjuku — drop bags at the hotel",
          category: "lodging",
          description: "Ask the hotel to hold them if the room isn't ready.",
        },
        {
          id: "d1-4",
          time: "14:30",
          title: "Cat cafe — Calico Kabukicho",
          category: "experience",
          location: "Kabukicho, Shinjuku",
          description: "5 min walk from Shinjuku Station (East Exit).",
          map: {
            lat: 35.6947,
            lng: 139.7025,
            label: "Calico Cat Cafe Kabukicho",
          },
        },
        {
          id: "d1-5",
          time: "18:30",
          title: "Easy dinner near the hotel",
          category: "food",
          description: "See options below.",
        },
        {
          id: "act-e507fcd0",
          time: "11:00",
          title: " Shinjuku Gyoen National Garden",
          category: "sightseeing",
        },
      ],
      foodOptions: [
        {
          id: "d1-f1",
          name: "Ichiran Ramen (Shinjuku Station East Exit)",
          description:
            "24hrs, no reservation, solo booths, customisable broth — ideal first dinner.",
          rating: 4.3,
          map: {
            lat: 35.6905859,
            lng: 139.7028052,
            label: "Ichiran Ramen Shinjuku",
          },
        },
        {
          id: "d1-f2",
          name: "Shinpachi Shokudo",
          description: "Grilled fish sets, English menu via iPad.",
          rating: 4.1,
          map: {
            lat: 35.6897831,
            lng: 139.7024563,
            label: "Shinpachi Shokudo",
          },
        },
        {
          id: "d1-f3",
          name: "Tatsuya Shinjuku",
          description: "Katsudon/gyudon bowls, fast, cash only.",
          rating: 4.4,
          map: {
            lat: 35.6898283,
            lng: 139.7029648,
            label: "Tatsuya Shinjuku",
          },
        },
        {
          id: "d1-f4",
          name: "Shinjuku Hikeshi Gyoza",
          description: "Casual, open 24 hours.",
          rating: 4.1,
          map: {
            lat: 35.6947761,
            lng: 139.7024133,
            label: "Shinjuku Hikeshi Gyoza",
          },
        },
        {
          id: "d1-f5",
          name: "Gyukatsu Motomura Shibuya",
          description: "Beef cutlet, 9 seats, go early.",
          rating: 4.9,
          map: {
            lat: 35.656977,
            lng: 139.7039981,
            label: "Gyukatsu Motomura Shibuya",
          },
        },
        {
          id: "d1-f6",
          name: "Himawari Sushi Shintoshin",
          description:
            "Genuine local conveyor-belt sushi, English menu, cash only.",
          rating: 4.3,
          map: {
            lat: 35.6889788,
            lng: 139.6975038,
            label: "Himawari Sushi Shintoshin",
          },
        },
        {
          id: "d1-f7",
          name: "Gyukatsu Motomura Shinjuku Main",
          rating: 4.9,
          map: {
            lat: 35.6946198,
            lng: 139.7005769,
            label: "Gyukatsu Motomura Shinjuku",
          },
        },
        {
          id: "d1-f8",
          name: "Gyopao Gyoza Shinjuku",
          rating: 4.8,
          map: {
            lat: 35.6902049,
            lng: 139.7026568,
            label: "Gyopao Gyoza Shinjuku",
          },
        },
        {
          id: "d1-f9",
          name: "Satoumisatoyama Tempura (Kabukicho)",
          description: "Chef's-choice sets, light not greasy.",
          rating: 4.8,
          map: {
            lat: 35.6971021,
            lng: 139.7034094,
            label: "Satoumisatoyama Tempura",
          },
        },
      ],
    },
    {
      id: "day-2",
      date: "2026-09-15",
      city: "Tokyo",
      region: "Bayside & Skytree",
      summary: "Tsukiji, Ginza, teamLab Planets, Skytree (floating slot)",
      notes: [
        "Skytree is the movable block — weather-dependent, finishes with a proper dinner. Default is tonight; fallback is Wednesday evening, but Wednesday ends out west at Ogikubo, so that means crossing the city again after climbing. Buy the date-specified ticket a day or two out once the forecast is clear.",
        "Don't buy knives at Tsukiji — Kappabashi (Day 3) is the better destination.",
      ],
      activities: [
        {
          id: "d2-1",
          time: "07:00",
          title: "Tsukiji Outer Market",
          category: "food",
          description:
            "Around 400 stalls — street food, seafood, dried goods, knives, ceramics. Eat along the lanes: tamagoyaki skewers, grilled scallops, uni, tuna. Closed Sundays and some Wednesdays. 07:00-09:00 is the sweet spot, ahead of the 10:00 tour-group surge — half the best stalls shut by 11:00. Cash.",
          map: {
            lat: 35.6647703,
            lng: 139.7702515,
            label: "Tsukiji Outer Market",
          },
        },
        {
          id: "d2-2",
          time: "10:00",
          title: "Ginza",
          category: "shopping",
          description:
            "Luxury retail district — wide boulevards, flagship stores. GINZA SIX (rooftop garden, basement food hall), Itoya (12 floors of stationery). 15 min walk from Tsukiji. Nothing opens before 10:00-11:00.",
          map: {
            lat: 35.6697688,
            lng: 139.7641762,
            label: "GINZA SIX",
          },
        },
        {
          id: "d2-3",
          time: "13:00",
          title: "teamLab Planets, Toyosu",
          category: "experience",
          description:
            "Barefoot walk-through digital art — you wade through knee-deep water in places. Book ahead, tickets sell out weeks ahead. Open 08:30-22:00, last entry an hour before close. Wear shorts or trousers rolled above the knee; lockers provided.",
          map: {
            lat: 35.6491207,
            lng: 139.7897739,
            label: "teamLab Planets Toyosu",
          },
        },
        {
          id: "d2-4",
          time: "17:00",
          title: "Tokyo Skytree",
          category: "sightseeing",
          description:
            "634m — tallest tower in Japan. Tembo Deck at 350m; the Galleria at 450m is an optional add-on, worth it on a clear evening. Sunset ~17:50 mid-September, so arrive by 17:00.",
          map: {
            lat: 35.7100627,
            lng: 139.8107004,
            label: "Tokyo Skytree",
          },
        },
        {
          id: "d2-5",
          time: "19:30",
          title: "Dinner at Solamachi or nearby",
          category: "food",
          description:
            'The "nice meal" slot — book once the Skytree date is fixed.',
        },
      ],
      foodOptions: [
        {
          id: "d2-f1",
          name: "Tsukiji Ihachi Honten",
          description: "A5 wagyu skewers/steak.",
          rating: 4.9,
          map: {
            lat: 35.6651162,
            lng: 139.7700701,
            label: "Tsukiji Ihachi Honten",
          },
        },
        {
          id: "d2-f2",
          name: "Tsumugi",
          description: "Japanese breakfast sets, 18-dish spread.",
          rating: 4.1,
          map: {
            lat: 35.667182,
            lng: 139.7722739,
            label: "Tsumugi",
          },
        },
        {
          id: "d2-f3",
          name: "Tsukiji Peppers Cafe",
          description: "Spice-forward cafe, home-made cola.",
          rating: 4.8,
          map: {
            lat: 35.6652788,
            lng: 139.77014,
            label: "Tsukiji Peppers Cafe",
          },
        },
        {
          id: "d2-f4",
          name: "Tsujita Ginza",
          description: "Tsukemen, vending-machine ordering.",
          rating: 4.7,
          map: {
            lat: 35.6714326,
            lng: 139.7673806,
            label: "Tsujita Ginza",
          },
        },
        {
          id: "d2-f5",
          name: "Ginza Akebono",
          description: "Seasonal daifuku/mochi, real craftsmanship.",
          rating: 4.4,
          map: {
            lat: 35.6714099,
            lng: 139.7645218,
            label: "Ginza Akebono",
          },
        },
        {
          id: "d2-f6",
          name: "Nobunaga Ramen",
          description:
            "Short hop to Nihonbashi — local favorite, not a tourist queue, ~¥1200.",
          rating: 4.8,
          map: {
            lat: 35.6792485,
            lng: 139.7799594,
            label: "Nobunaga Ramen",
          },
        },
        {
          id: "d2-f7",
          name: "Bistro Fukumimi",
          description:
            "Yakitori/izakaya, GINZA SIX B1. Book ahead — Ginza backup if Skytree slips.",
          rating: 4.8,
          map: {
            lat: 35.6717759,
            lng: 139.7604117,
            label: "Bistro Fukumimi",
          },
        },
      ],
    },
    {
      id: "day-3",
      date: "2026-09-16",
      city: "Tokyo",
      region: "Old Tokyo & climbing",
      summary: "Senso-ji, Kappabashi, Akihabara, B-Pump Ogikubo",
      notes: [
        "Honest flag: you'll have walked Asakusa and Akihabara first, so you won't be fresh at a genuinely hard gym. If climbing well matters more than the temples, invert the day — subject to B-Pump's opening hours.",
        "Akihabara also has cat cafes, if you'd rather move that off Day 1.",
      ],
      activities: [
        {
          id: "d3-1",
          time: "08:30",
          title: "Senso-ji Temple + Nakamise Street",
          category: "sightseeing",
          description:
            "Tokyo's oldest temple, founded 645 — entered through the Kaminarimon gate and its enormous red lantern. Nakamise-dori, the 250m approach lined with about 90 stalls. Go early — by 10:00 it's shoulder-to-shoulder. Main hall opens 06:00, stalls shut ~17:00-18:00.",
          map: {
            lat: 35.7147651,
            lng: 139.7966553,
            label: "Senso-ji Temple",
          },
        },
        {
          id: "d3-2",
          time: "10:30",
          title: "Kappabashi Kitchen Town",
          category: "shopping",
          description:
            "800m street of restaurant supply shops — knife shop (the knife destination in Tokyo), sampuru (plastic food sample) shops. Trade hours ~10:00-17:00, some shut Sundays. 10-12 min walk from Senso-ji.",
          map: {
            lat: 35.7105797,
            lng: 139.7879645,
            label: "Kappabashi Kitchen Town",
          },
          travelFromPrevious: {
            mode: "walking",
            duration: "10-12 min",
            distanceKm: 0.9,
          },
        },
        {
          id: "d3-3",
          time: "12:00",
          title: "Akihabara Electric Town",
          category: "shopping",
          description:
            "Otaku capital — anime, manga, retro gaming, figures, stacked vertically. Super Potato (retro gaming, opens 11:00) or Mandarake Complex (8-floor flagship, 90 min alone) — pick 1-2. Ginza Line 2 stops or 30 min walk from Kappabashi; nothing opens before 10-11am.",
          map: {
            lat: 35.6996473,
            lng: 139.7713703,
            label: "Akihabara Electric Town",
          },
        },
        {
          id: "d3-4",
          time: "15:00",
          title: "B-Pump Ogikubo — bouldering",
          category: "experience",
          location: "Ogikubo",
          description:
            "130 problems, belt-graded 8Q to 3Dan, a competition wall and a Rocklands replica. Run by Katsuaki Miyazawa and Tsukuru Hori (the Katsu Method setters) — a popular training venue where national team and international comp athletes routinely show up in normal sessions. 1 min from JR Ogikubo; direct from Akihabara on the Chuo-Sobu line (~25 min, no changes). Check opening hours before the day — plenty of Tokyo gyms don't open until midday on weekdays. Shoe rental available.",
          map: {
            lat: 35.7048,
            lng: 139.6198,
            label: "B-Pump Ogikubo",
          },
        },
      ],
      foodOptions: [
        {
          id: "d3-f1",
          name: "Asakusa Gyukatsu",
          description:
            "Cook-your-own beef cutlet, near Senso-ji, expect a wait.",
          rating: 4.8,
          map: {
            lat: 35.7107673,
            lng: 139.7959519,
            label: "Asakusa Gyukatsu",
          },
        },
        {
          id: "d3-f2",
          name: "Ichinoya Wagyu",
          description: "Wagyu rice box, near Senso-ji.",
          rating: 4.9,
          map: {
            lat: 35.7122837,
            lng: 139.7972069,
            label: "Ichinoya Wagyu",
          },
        },
        {
          id: "d3-f3",
          name: "Gyukatsu Motomura (Akihabara)",
          description: "Beef cutlet.",
          rating: 4.8,
          map: {
            lat: 35.6977251,
            lng: 139.7716177,
            label: "Gyukatsu Motomura Akihabara",
          },
        },
        {
          id: "d3-f4",
          name: "Gyukatsu Ichinisan (Akihabara)",
          description: "Beef cutlet.",
          rating: 4.8,
          map: {
            lat: 35.7020198,
            lng: 139.7705967,
            label: "Gyukatsu Ichinisan Akihabara",
          },
        },
      ],
    },
    {
      id: "day-4",
      date: "2026-09-17",
      city: "Tokyo",
      summary: "Still being planned",
      notes: [
        "The 4th Tokyo night — the original 13-night booking always had Tokyo at 4 nights; the source plan's Day 1-3 content just didn't cover it. Nothing scheduled yet.",
      ],
      activities: [],
    },
    {
      id: "day-5",
      date: "2026-09-18",
      city: "Hakone",
      region: "Tokyo → Hakone (1 night)",
      summary: "Romancecar, Owakudani, Lake Ashi, onsen — no car rental",
      notes: [
        "No car rentals anywhere on this trip — Hakone runs on the Tozan railway → cable car → ropeway loop instead, which is timetable-bound, so the early Romancecar matters more, not less.",
        "Look at the Hakone Free Pass — it covers the Tozan train, cable car, ropeway, the Ashi boat and the buses in one ticket.",
      ],
      activities: [
        {
          id: "d5-1",
          time: "07:30",
          title: "Check out of Shinjuku. Romancecar to Hakone-Yumoto",
          category: "transport",
          description: "~85 min direct from Shinjuku.",
        },
        {
          id: "d5-2",
          time: "10:30",
          title: "Owakudani",
          category: "sightseeing",
          description:
            "Volcanic valley — try the black eggs. Reached via the Tozan railway/cable car/ropeway loop.",
          map: {
            lat: 35.2436011,
            lng: 139.0197304,
            label: "Owakudani",
          },
        },
        {
          id: "d5-3",
          time: "12:30",
          title: "Lake Ashi",
          category: "sightseeing",
          description:
            "Pirate ship cruise, Hakone Shrine, Mt Fuji views weather-permitting.",
          map: {
            lat: 35.2095674,
            lng: 139.0034626,
            label: "Lake Ashi",
          },
          travelFromPrevious: {
            mode: "transit",
            note: "Ropeway/cable car loop — no car rental",
          },
        },
        {
          id: "d5-4",
          time: "19:00",
          title: "Check in — onsen",
          category: "lodging",
        },
      ],
      foodOptions: [
        {
          id: "d5-f1",
          name: "CIRCLE HAKONE",
          description: "Nepalese curry/naan, Miyanoshita.",
          rating: 4.9,
          map: {
            lat: 35.2434943,
            lng: 139.0615172,
            label: "Circle Hakone",
          },
        },
        {
          id: "d5-f2",
          name: "Kinnode Shussei",
          description: "Ochazuke, traditional dishes. Near Yumoto.",
          rating: 4.9,
          map: {
            lat: 35.2312311,
            lng: 139.099816,
            label: "Kinnode Shussei",
          },
        },
        {
          id: "d5-f3",
          name: "Saien",
          description:
            "Buddhist monk breakfast, vegetarian, book ahead. Opens 08:00-10:00 only — fits the morning you leave for Kyoto.",
          rating: 4.9,
          map: {
            lat: 35.2443023,
            lng: 139.0581128,
            label: "Saien Hakone",
          },
        },
        {
          id: "d5-f4",
          name: "GORA Brewery & Grill",
          description: "Fresh meat and sushi prepared live.",
          rating: 4.5,
          map: {
            lat: 35.2382,
            lng: 139.0567,
            label: "GORA Brewery & Grill",
          },
        },
      ],
    },
    {
      id: "day-6",
      date: "2026-09-19",
      city: "Kyoto",
      region: "Hakone → Kyoto (travel day)",
      summary: "Shinkansen to Kyoto, check in for 3 nights",
      activities: [
        {
          id: "d6-1",
          time: "10:00",
          title: "Odawara → Kyoto by Shinkansen",
          category: "transport",
          description: "Est. ~2 hrs (Hikari).",
        },
        {
          id: "d6-2",
          time: "13:00",
          title: "Kyoto check-in",
          category: "lodging",
          description: "3 nights.",
        },
      ],
    },
    {
      id: "day-7",
      date: "2026-09-20",
      city: "Kyoto",
      summary: "Still being planned",
      notes: [
        "Nara and Uji are both easy day trips from here. Osaka is ~15 min by Shinkansen / ~30 min by JR Special Rapid, so anything Osaka-side stays reachable.",
      ],
      activities: [],
    },
    {
      id: "day-8",
      date: "2026-09-21",
      city: "Kyoto",
      summary: "Still being planned",
      activities: [],
    },
    {
      id: "day-9",
      date: "2026-09-22",
      city: "Osaka",
      region: "Kyoto → Osaka (travel day)",
      summary: "Short hop to Osaka, check in for 3 nights",
      activities: [
        {
          id: "d9-1",
          time: "10:00",
          title: "Kyoto → Osaka",
          category: "transport",
          description: "~15 min Shinkansen or ~30 min JR Special Rapid.",
        },
        {
          id: "d9-2",
          time: "12:00",
          title: "Osaka check-in",
          category: "lodging",
          description: "3 nights.",
        },
      ],
    },
    {
      id: "day-10",
      date: "2026-09-23",
      city: "Osaka",
      summary: "Still being planned",
      activities: [],
    },
    {
      id: "day-11",
      date: "2026-09-24",
      city: "Osaka",
      summary: "Still being planned",
      notes: [
        "Pack for Yoshino in the evening — leave the big bag in Osaka or forward it.",
      ],
      activities: [],
    },
    {
      id: "day-12",
      date: "2026-09-25",
      city: "Yoshino",
      region: "Osaka → Yoshino (1 night)",
      summary: "Yoshino-Kumano National Park",
      notes: [
        "Rural — check last train and dinner options in advance, food is limited after dark.",
      ],
      activities: [
        {
          id: "d12-1",
          time: "09:00",
          title: "Osaka Abenobashi → Yoshino",
          category: "transport",
          description:
            "Kintetsu Minami-Osaka Line, est. ~1h15 by Limited Express (~1h45 ordinary).",
        },
        {
          id: "d12-2",
          time: "11:00",
          title: "Yoshino-Kumano National Park",
          category: "sightseeing",
          description: "Mt Yoshino, ropeway, Kinpusen-ji, mountain walks.",
          map: {
            lat: 34.3625,
            lng: 135.8664,
            label: "Mount Yoshino",
          },
        },
        {
          id: "d12-3",
          time: "18:00",
          title: "Yoshino stay",
          category: "lodging",
        },
      ],
    },
    {
      id: "day-13",
      date: "2026-09-26",
      city: "Tokyo",
      region: "Yoshino → Tokyo (final night)",
      summary: "Shinkansen back to Tokyo",
      notes: [
        "Start early — est. ~4.5-5 hrs door to door via Kyoto/Shin-Osaka.",
      ],
      activities: [
        {
          id: "d13-1",
          time: "06:00",
          title: "Yoshino → Kyoto/Shin-Osaka → Tokyo",
          category: "transport",
          description: "Shinkansen — est. ~4.5-5 hrs door to door.",
        },
      ],
    },
    {
      id: "day-14",
      date: "2026-09-27",
      city: "Tokyo",
      region: "Haneda → Heathrow",
      summary: "Return flight — JL7121, direct to London",
      activities: [
        {
          id: "d14-1",
          time: "13:05",
          title: "Depart Tokyo Haneda — JL7121",
          category: "transport",
          location: "Haneda Terminal 3",
          description:
            "Japan Airlines JL7121, Terminal 3. Arrives London Heathrow at 19:50 local time (same day).",
        },
      ],
    },
  ],
};
