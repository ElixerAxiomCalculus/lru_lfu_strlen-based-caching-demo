import { SearchDoc } from "../types";

// mock corpus of documents (acts like a search engine database)
const corpus: SearchDoc[] = [
  { id: 0, title: "Alpha", text: "Alpha document about caching.", size: 10, url: "#" },
  { id: 1, title: "Beta", text: "Beta doc covering evictions.", size: 12, url: "#" },
  { id: 2, title: "Gamma", text: "Gamma doc on frequency rules.", size: 8, url: "#" },
  { id: 3, title: "Delta", text: "Delta doc on collisions.", size: 6, url: "#" },
  { id: 4, title: "Epsilon", text: "Epsilon doc with examples.", size: 7, url: "#" },
  { id: 5, title: "Zeta", text: "Zeta doc on size-based evictions.", size: 5, url: "#" },
];

// searches documents for keyword matches
export function searchDocs(query: string): SearchDoc[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = corpus
    .map((d) => {
      const text = (d.title + " " + d.text).toLowerCase();
      const score = text.includes(q) ? 1 : 0;
      return { score, d };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.d);

  return scored.slice(0, 10);
}
