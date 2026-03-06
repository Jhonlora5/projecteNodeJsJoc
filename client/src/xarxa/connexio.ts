const protocol = window.location.protocol === "https:" ? "wss" : "ws";

export const connexio = new WebSocket(`${protocol}://${window.location.host}`);

export function enviarMissatge(dades: any) {
    connexio.send(JSON.stringify(dades));
}