"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarCompteEnrere = iniciarCompteEnrere;
const utilitats_1 = require("./utilitats");
let compteEnrereActiu = false;
/**
 * Envia el comte enrrere als usuaris connectats.
 * Quan el comptador es 0 envia inici de la partida.
 */
function iniciarCompteEnrere(wss) {
    if (compteEnrereActiu)
        return;
    compteEnrereActiu = true;
    let compte = 3;
    const interval = setInterval(() => {
        (0, utilitats_1.enviarATots)(wss, {
            tipus: "compteEnrere",
            valor: compte
        });
        compte--;
        if (compte < 0) {
            clearInterval(interval);
            (0, utilitats_1.enviarATots)(wss, {
                tipus: "iniciPartida"
            });
            compteEnrereActiu = false;
        }
    }, 1000);
}
