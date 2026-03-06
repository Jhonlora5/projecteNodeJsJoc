/**
 * Creem la llista de posibles personatges.
 */
export const TIPUS_PERSONATGES = [
    "mag", "barbar", "elf", "cavaller", "arquera",
    "assassi", "paladi", "nigromant", "druida", "monjo"
] as const;

export type TipusPersonatge =
    typeof TIPUS_PERSONATGES[number];


/**
 * Creem la llista de colors de personatges a repartir.
 */

export const TIPUS_COLORS = [
    "red", "blue", "green", "purple", "orange",
    "cyan", "yellow", "pink", "lime", "white"
];

export type TipusColors = 
    typeof TIPUS_COLORS[number];