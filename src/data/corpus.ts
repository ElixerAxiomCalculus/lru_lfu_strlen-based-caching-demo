import { SearchDoc } from "../lib/types";

export const corpus: SearchDoc[] = [
  { id: 0, title: "Alpha", text: "Alpha document about caching.", size: 10, url: "#" },
  { id: 1, title: "Beta", text: "Beta doc covering evictions.", size: 12, url: "#" },
  { id: 2, title: "Gamma", text: "Gamma doc on frequency rules.", size: 8, url: "#" },
  { id: 3, title: "Delta", text: "Delta doc on collisions.", size: 6, url: "#" },
  { id: 4, title: "Epsilon", text: "Epsilon doc with examples.", size: 7, url: "#" },
  { id: 5, title: "Zeta", text: "Zeta doc on size-based evictions.", size: 5, url: "#" }
];
