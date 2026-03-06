"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarATots = enviarATots;
exports.obtenirPersonatgeAleatori = obtenirPersonatgeAleatori;
exports.obtenirColorAleatori = obtenirColorAleatori;
exports.retornarPersonatge = retornarPersonatge;
exports.retornarColor = retornarColor;
const ws_1 = require("ws");
const constants_1 = require("../models/constants");
/**
 * Funcio encarregada de transformar a json la informacio i tornar a cada client.
 * @param dades json de dades.
 */
function enviarATots(wss, dades) {
    const text = JSON.stringify(dades);
    wss.clients.forEach(client => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(text);
        }
    });
}
/**
 * Per evitar repeticions de personatges:
 * Creem personatgesDisponibles (quan entra un l'esborarem de la llista, quan surt el tornem).
 */
let personatgesDisponibles = [...constants_1.TIPUS_PERSONATGES];
/**
 * Per evitar repeticions de colors:
 * Creem colorsDisponibles (quan entra un l'esborarem de la llista, quan surt el tornem).
 */
let colorsDisponibles = [...constants_1.TIPUS_COLORS];
/**
 * Si no queden personatges es reinicia.
 * Escull aleatroiament entre els personatges disponibles, l'esborrem i els retorna.
 * @returns
 */
function obtenirPersonatgeAleatori() {
    if (personatgesDisponibles.length === 0) {
        personatgesDisponibles = [...constants_1.TIPUS_PERSONATGES];
    }
    const indexPersonatge = Math.floor(Math.random() * personatgesDisponibles.length);
    const tipus = personatgesDisponibles[indexPersonatge];
    personatgesDisponibles.splice(indexPersonatge, 1);
    return tipus;
}
/**
 * Agafem un color aleatori de la llista de colors i l'esborrem de la llista.
 * @returns  color disponible.
 */
function obtenirColorAleatori() {
    if (colorsDisponibles.length === 0) {
        colorsDisponibles = [...constants_1.TIPUS_COLORS];
    }
    const indexColor = Math.floor(Math.random() * colorsDisponibles.length);
    const color = colorsDisponibles[indexColor];
    colorsDisponibles.splice(indexColor, 1);
    return color;
}
function retornarPersonatge(tipus) {
    personatgesDisponibles.push(tipus);
}
function retornarColor(color) {
    colorsDisponibles.push(color);
}
