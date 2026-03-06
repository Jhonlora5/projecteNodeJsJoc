import { WebSocketServer, WebSocket } from "ws";
import { TIPUS_COLORS, TIPUS_PERSONATGES,TipusPersonatge, TipusColors} from "../models/constants";

/**
 * Funcio encarregada de transformar a json la informacio i tornar a cada client.
 * @param dades json de dades.
 */

export function enviarATots( wss: WebSocketServer, dades: any ) {
    const text = JSON.stringify(dades);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(text);
        }
    });
}

/**
 * Per evitar repeticions de personatges:
 * Creem personatgesDisponibles (quan entra un l'esborarem de la llista, quan surt el tornem).
 */

let personatgesDisponibles = [...TIPUS_PERSONATGES];

/**
 * Per evitar repeticions de colors:
 * Creem colorsDisponibles (quan entra un l'esborarem de la llista, quan surt el tornem).
 */
let colorsDisponibles = [...TIPUS_COLORS];


/**
 * Si no queden personatges es reinicia.
 * Escull aleatroiament entre els personatges disponibles, l'esborrem i els retorna.
 * @returns 
 */
export function obtenirPersonatgeAleatori(): TipusPersonatge {
    if (personatgesDisponibles.length === 0) {
        personatgesDisponibles = [...TIPUS_PERSONATGES];
    }

    const indexPersonatge =
        Math.floor(Math.random() * personatgesDisponibles.length);

    const tipus = personatgesDisponibles[indexPersonatge];

    personatgesDisponibles.splice(indexPersonatge, 1);

    return tipus;
}

/**
 * Agafem un color aleatori de la llista de colors i l'esborrem de la llista.
 * @returns  color disponible.
 */

export function obtenirColorAleatori(): TipusColors {

    if (colorsDisponibles.length === 0) {
        colorsDisponibles = [...TIPUS_COLORS];
    }

    const indexColor =
        Math.floor(Math.random() * colorsDisponibles.length);

    const color = colorsDisponibles[indexColor];

    colorsDisponibles.splice(indexColor, 1);

    return color;
}

export function retornarPersonatge(tipus: string) {
    personatgesDisponibles.push(tipus as any);
}

export function retornarColor(color: string) {
    colorsDisponibles.push(color as any);
}