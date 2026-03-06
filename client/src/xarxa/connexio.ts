export const connexio = new WebSocket(`ws://${window.location.host}`);

export function enviarMissatge(dades: any) {
    connexio.send(JSON.stringify(dades));
}