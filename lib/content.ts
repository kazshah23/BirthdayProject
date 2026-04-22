// EDIT THIS FILE to personalize the experience.
// Every string marked // EDIT: is meant for you to replace.
// Keep answers lowercase — matching is case/space/punctuation insensitive.

export const BIRTHDAY_GIRL = "aisha"; // EDIT: her name, used on the intro screen

// EDIT: the answer to the lock-screen question (shared inside joke works best)
export const LOCK_QUESTION = "What is your best friends name?";
export const LOCK_ANSWER = "pingu"; // EDIT: normalized match

export const INTRO_NOTE =
  // EDIT: a short welcome line shown on the intro screen
  "So yeah this is what I have been doing. ";

export type TextTrivia = { type?: "text"; q: string; a: string };
export type MCTrivia = {
  type: "mc";
  q: string;
  options: string[];
  correct: number; // index into options
};
export type SliderTrivia = {
  type: "slider";
  q: string;
  min: number;
  max: number;
  answer: number;
  unit?: string;
};
export type Trivia = TextTrivia | MCTrivia | SliderTrivia;

export type Location = {
  id: string;
  name: string;
  blurb: string;
  coords: [number, number]; // [lat, lng]
  trivia: Trivia[];
  nextPlan: string; // shown after trivia completes, in place of a riddle
  riddle: { text: string; answer: string };
};

export const locations: Location[] = [
  {
    id: "cafe",
    name: "Cafe",
    blurb: "Where it all started — a cozy table in River North.",
    coords: [41.893, -87.632],
    trivia: [
      { q: "Where was our first date?", a: "pokelab" },
      {
        type: "mc",
        q: "Where did we hangout on the second day we met?",
        options: ["UGL", "Krannert", "Scott Park", "Nyla's Apartment"],
        correct: 1,
      },
      {
        type: "mc",
        q: "What was the first thing I got you?",
        options: [
          "Veer Zara DVD",
          "Toy Pastel Yellow Convertible",
          "Cheezits",
          "Stuffed Animal",
        ],
        correct: 2,
      },
      {
        type: "mc",
        q: "Before DM'ing you, who did I ask about you?",
        options: ["Manita", "Prithvi", "Your dad", "Pingu"],
        correct: 1,
      },
      {
        type: "slider",
        q: "How long did you ghost me for after I first messaged you?",
        min: 1,
        max: 5,
        answer: 3,
        unit: "weeks",
      },
      {
        type: "mc",
        q: "What was the second thing I got you?",
        options: [
          "Veer Zara DVD",
          "Toy Pastel Yellow Convertible",
          "Cheezits",
          "Stuffed Animal",
        ],
        correct: 1,
      },
    ],
    nextPlan: "we are going to navy pier for the fun house maze!",
    riddle: {
      text:
        "I'm whipped and churned, I'm smooth and sweet, / a dairy dream, a summer treat. / Scoop me up — what am I?",
      answer: "cream",
    },
  },
  {
    id: "navy-pier",
    name: "Navy Pier",
    // EDIT
    blurb: "The night of the ferris wheel and the fireworks over the lake.",
    coords: [41.8917, -87.6086],
    trivia: [
      {
        type: "mc",
        q: "When is Zayn Malik's Birthday?",
        options: [
          "January 11th 1992",
          "January 13th 1992",
          "January 11th 1993",
          "January 12th 1993",
        ],
        correct: 3,
      },
      {
        type: "mc",
        q: "What is Kazmain's favorite color?",
        options: ["Black", "Orange", "Brown", "Dark Brown"],
        correct: 3,
      },
      {
        type: "mc",
        q: "What is Zayn Malik's favorite color?",
        options: [
          "Green",
          "Purple",
          "Dark Blue",
          "I swear to god if there was a right answer",
        ],
        correct: 3,
      },
      {
        type: "mc",
        q: "What city was Kazmain born in?",
        options: ["Libertyville", "Gurnee", "Glenview", "Chicago"],
        correct: 2,
      },
      {
        type: "mc",
        q: "What did Kazmain major in at UIUC?",
        options: [
          "Computer Science",
          "Computer Science + Statistics",
          "Computer Science + Economics",
          "Data Science",
        ],
        correct: 2,
      },
      {
        type: "mc",
        q: "What is Kazmain's favorite thing about you?",
        options: ["True", "False"],
        correct: 0,
      },
    ],
    nextPlan: "we are having a Sushi Picnic!",
    riddle: {
      text:
        "I'm crystal born from water's chill, / in winter's breath I hold so still. / I'll chill your drink, I'll numb your toes — / one little word, what do you suppose?",
      answer: "hi",
    },
  },
  {
    id: "planetarium",
    name: "Adler Planetarium",
    blurb: "Stargazing by the lake, trying to find our constellations.",
    coords: [41.8663, -87.6069],
    trivia: [
      {
        type: "mc",
        q: "What sound does your favorite penguin make?",
        options: ["Yip Yip", "Noot Noot", "Chow Chow", "Woof Woof"],
        correct: 1,
      },
    ],
    nextPlan: "it's time for your first gift!",
    riddle: {
      text:
        "Silent and swift, a shadow at night, / dressed all in black, I vanish from sight. / I leap without sound, I strike without trace — / what am I?",
      answer: "hi",
    },
  },
];

// The three riddle answers combine into the final rebus.
// ninja + ice + cream  →  NINJA CREAMI (rearranging letters of "ice" + "cream")
export const finalReveal = {
  wordsInOrder: ["kaz", "go", "get", "it"],
  answer: "You Did It!",
  // EDIT: your love note for the final screen
  loveNote:
    "To many more birthdays in the future. So honored to be able to experience more life with you. You deserve everything and more - Kazmain",
};

// Shown at the bottom of the map inside an expandable button. All four
// lines have placeholder "blocks" from the start; each completed flower
// unlocks two lines (so 2 flowers reveal the whole riddle, and the 3rd
// flower turns on the "solve it!" button).
export const finalRiddle = {
  lines: [
    "High up in the sky it shines like an angel's crown",
    "Stealthy in presence, roaring with sound",
    "Fall down spinning and you might scream",
    "Cold to the touch, this might be good for the team",
  ],
};
