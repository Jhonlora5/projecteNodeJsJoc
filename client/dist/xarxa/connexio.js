export const connexio = new WebSocket(`ws://${window.location.host}`);
export function enviarMissatge(dades) {
    connexio.send(JSON.stringify(dades));
}
