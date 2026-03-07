// Interficie encarregada de l'estructura del projectil.
export interface Projectil {
    x: number;
    y: number;
    dx: number;
    dy: number;
    velocitat: number;
    color: string;
    autor: string;
}