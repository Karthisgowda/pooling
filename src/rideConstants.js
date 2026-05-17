export const RIDE_STATUSES = ["All", "Open", "Full", "Completed"];

export const SORT_OPTIONS = [
  { value: "date", label: "Earliest trip" },
  { value: "fare", label: "Lowest fare" },
  { value: "seats", label: "Most seats open" },
];

export const ASSISTANT_PROMPTS = [
  "Which rides still have seats?",
  "Summarize today's open rides.",
  "Which route has the lowest fare?",
];
