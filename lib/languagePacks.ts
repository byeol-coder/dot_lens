/**
 * Localization packs — data-driven braille + UI tuning for new languages.
 *
 * Rather than hard-coding every language into the braille engine, a pack is
 * plain data: a character → braille-cell map plus optional UI string overrides.
 * Field teams can upload a pack (JSON), test it against sample text, and a
 * braille reviewer validates it — the same QA discipline the rest of the app
 * uses. Marathi (Devanagari / Bharati Braille) ships as the first built-in pack.
 *
 * Coverage note: the seed Marathi map covers independent vowels, the core
 * consonant set, common matras, anusvara, virama and danda. Conjuncts, ऋ/ॠ and
 * ळ-class letters are intentionally left unmapped so the QA layer flags them —
 * a real Bharati Braille TVI fills the gaps via an uploaded pack revision.
 */

export type PackCell = number[]; // dot numbers 1–6

export interface LanguagePack {
  /** BCP-47-ish code, e.g. "mr". */
  code: string;
  name: { en: string; native: string };
  script: string;
  brailleStandard: string;
  /** Marks the seed packs that ship with the app (not user-uploaded). */
  builtin?: boolean;
  /** Review state — packs reach learners only once a reviewer approves. */
  status: "draft" | "approved";
  /** Character → one or more braille cells. */
  map: Record<string, PackCell[]>;
  /** Optional UI string overrides for the localized surface. */
  ui?: Record<string, string>;
}

/* ── Marathi (Devanagari) — Bharati Braille seed ──────────────────────────── */

const MARATHI_MAP: Record<string, PackCell[]> = {
  // Independent vowels
  "अ": [[1]], "आ": [[3, 4, 5]], "इ": [[2, 4]], "ई": [[3, 5]],
  "उ": [[1, 3, 6]], "ऊ": [[1, 2, 5, 6]], "ए": [[1, 5]], "ऐ": [[3, 4]],
  "ओ": [[1, 3, 5]], "औ": [[2, 4, 6]],
  // Vowel signs (matras) — share cells with the independent vowels
  "ा": [[3, 4, 5]], "ि": [[2, 4]], "ी": [[3, 5]], "ु": [[1, 3, 6]],
  "ू": [[1, 2, 5, 6]], "े": [[1, 5]], "ै": [[3, 4]], "ो": [[1, 3, 5]], "ौ": [[2, 4, 6]],
  // Consonants
  "क": [[1, 3]], "ख": [[4, 6]], "ग": [[1, 2, 4, 5]], "घ": [[1, 2, 6]], "ङ": [[3, 4, 6]],
  "च": [[1, 4]], "छ": [[1, 6]], "ज": [[2, 4, 5]], "झ": [[2, 5, 6]], "ञ": [[2, 5]],
  "ट": [[2, 3, 4, 5, 6]], "ठ": [[2, 4, 5, 6]], "ड": [[1, 2, 4, 6]], "ढ": [[1, 2, 3, 4, 5, 6]], "ण": [[3, 4, 5, 6]],
  "त": [[2, 3, 4, 5]], "थ": [[1, 4, 5, 6]], "द": [[1, 4, 5]], "ध": [[2, 3, 4, 6]], "न": [[1, 3, 4, 5]],
  "प": [[1, 2, 3, 4]], "फ": [[1, 2, 4]], "ब": [[1, 2]], "भ": [[4, 5]], "म": [[1, 3, 4]],
  "य": [[1, 3, 4, 5, 6]], "र": [[1, 2, 3, 5]], "ल": [[1, 2, 3]], "व": [[1, 2, 3, 6]],
  "श": [[1, 4, 6]], "ष": [[1, 2, 3, 4, 6]], "स": [[2, 3, 4]], "ह": [[1, 2, 5]],
  // Signs
  "ं": [[5, 6]],       // anusvara
  "ः": [[6]],          // visarga
  "्": [[4]],          // virama / halant
  "।": [[2, 5, 6]],    // danda (sentence end)
};

export const MARATHI_PACK: LanguagePack = {
  code: "mr",
  name: { en: "Marathi", native: "मराठी" },
  script: "Devanagari",
  brailleStandard: "Bharati Braille",
  builtin: true,
  status: "draft",
  map: MARATHI_MAP,
  ui: {
    explore: "अन्वेषण करा",
    hint: "सूचना",
    quiz: "प्रश्नमंजुषा",
    summary: "सारांश",
  },
};

export const BUILTIN_PACKS: LanguagePack[] = [MARATHI_PACK];

/* ── Upload store (localStorage) ──────────────────────────────────────────── */

const STORAGE_KEY = "dotlens.languagePacks.v1";
const CHANGE_EVENT = "dotlens:languagePacks";

function canStore(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function uploaded(): LanguagePack[] {
  if (!canStore()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as LanguagePack[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** All packs: built-ins plus user-uploaded (uploaded override built-ins by code). */
export function listPacks(): LanguagePack[] {
  const up = uploaded();
  const codes = new Set(up.map((p) => p.code));
  return [...up, ...BUILTIN_PACKS.filter((p) => !codes.has(p.code))];
}

export function getPack(code: string): LanguagePack | undefined {
  return listPacks().find((p) => p.code === code);
}

export interface PackValidation {
  ok: boolean;
  errors: string[];
  pack?: LanguagePack;
}

/** Validate an unknown JSON value as a LanguagePack. */
export function validatePack(raw: unknown): PackValidation {
  const errors: string[] = [];
  const p = raw as Partial<LanguagePack>;
  if (!p || typeof p !== "object") return { ok: false, errors: ["Not an object."] };
  if (!p.code || typeof p.code !== "string") errors.push("Missing string field: code");
  if (!p.name || typeof p.name !== "object") errors.push("Missing object field: name { en, native }");
  if (!p.map || typeof p.map !== "object") errors.push("Missing object field: map");
  if (p.map && typeof p.map === "object") {
    for (const [ch, cells] of Object.entries(p.map)) {
      if (!Array.isArray(cells) || !cells.every((c) => Array.isArray(c) && c.every((d) => Number.isInteger(d) && d >= 1 && d <= 6))) {
        errors.push(`Invalid braille cells for "${ch}" (expected arrays of dot numbers 1–6).`);
        break;
      }
    }
  }
  if (errors.length) return { ok: false, errors };
  const pack: LanguagePack = {
    code: p.code as string,
    name: { en: p.name!.en ?? (p.code as string), native: p.name!.native ?? "" },
    script: p.script ?? "",
    brailleStandard: p.brailleStandard ?? "custom",
    status: p.status === "approved" ? "approved" : "draft",
    map: p.map as Record<string, PackCell[]>,
    ui: p.ui,
  };
  return { ok: true, errors: [], pack };
}

export function savePack(pack: LanguagePack): void {
  if (!canStore()) return;
  const up = uploaded().filter((p) => p.code !== pack.code);
  up.unshift(pack);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(up));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    /* ignore */
  }
}

export function deletePack(code: string): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uploaded().filter((p) => p.code !== code)));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    /* ignore */
  }
}

export function subscribePacks(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onChange = () => cb();
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/* ── Pack-driven translation ──────────────────────────────────────────────── */

export interface PackTranslateResult {
  cells: PackCell[];
  /** Characters with no mapping — the QA signal that a reviewer must fill them. */
  untranslatable: { char: string; index: number }[];
}

export function translateWithPack(text: string, pack: LanguagePack): PackTranslateResult {
  const cells: PackCell[] = [];
  const untranslatable: { char: string; index: number }[] = [];
  [...text].forEach((ch, i) => {
    if (ch === " ") {
      cells.push([]);
      return;
    }
    const mapped = pack.map[ch];
    if (mapped && mapped.length) {
      cells.push(...mapped);
    } else {
      untranslatable.push({ char: ch, index: i });
    }
  });
  return { cells, untranslatable };
}

/** A downloadable starter pack so authors have a correct shape to edit. */
export function packTemplate(): LanguagePack {
  return {
    code: "xx",
    name: { en: "New language", native: "" },
    script: "",
    brailleStandard: "custom",
    status: "draft",
    map: { a: [[1]], b: [[1, 2]], c: [[1, 4]] },
    ui: { explore: "", hint: "", quiz: "", summary: "" },
  };
}
