/**
 * Si el protocol de la finestra es https, posa wss com a protocol per enviar dades al servidor.
 * si no, posa ws.
*/
const protocol = window.location.protocol === "https:" ? "wss" : "ws";

// Creem la connexio amb websocket desde client.
export const connexio = new WebSocket(`${protocol}://${window.location.host}`);

// Creem la funcio per l'enviament de dades al servidor en format json.
export function enviarMissatge(dades: any) {
    connexio.send(JSON.stringify(dades));
}