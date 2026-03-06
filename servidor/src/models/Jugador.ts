import {TipusPersonatge, TipusColors} from "./constants"

export interface Jugador {
    id: string;
    nom: string;
    x: number;
    y: number;
    vida: number;
    punts: number;
    tipus: TipusPersonatge;
    color: TipusColors;
    preparat: boolean;
}