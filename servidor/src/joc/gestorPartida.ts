import { WebSocketServer } from "ws";
import { enviarATots } from "./utilitats";

let compteEnrereActiu = false;
/**
 * Envia el comte enrrere als usuaris connectats.
 * Quan el comptador es 0 envia inici de la partida.
 */
export function iniciarCompteEnrere(wss: WebSocketServer) {

    if (compteEnrereActiu) return;

    compteEnrereActiu = true;

    let compte = 3;

    const interval = setInterval(() => {

        enviarATots(wss, {
            tipus: "compteEnrere",
            valor: compte
        });

        compte--;

        if (compte < 0) {
            clearInterval(interval);

            enviarATots(wss, {
                tipus: "iniciPartida"
            });

            compteEnrereActiu = false;
        }

    }, 1000);
}