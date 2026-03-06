export interface JugadorClient {
    id: string;
    nom: string;
    x: number;
    y: number;
    vida: number;
    punts: number;
    tipus: string;
    color: string;
    direccio?: number;
}