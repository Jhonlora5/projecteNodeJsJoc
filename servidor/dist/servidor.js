"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Realitzem les importacions corresponents:
 * express: Framwork web per servir fitxers.
 * http: Node crea el servidor http base.
 * ws: Llibreria websocket per comunicació en temps real.
 * path: Permet crear rutes absolutes correctes.
 * randomUUID: Genera ID unics per a cada jugador.
 */
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const utilitats_1 = require("./joc/utilitats");
const gestorPartida_js_1 = require("./joc/gestorPartida.js");
/**
 * Creació del servidor express.
 */
const app = (0, express_1.default)();
const servidorHttp = http_1.default.createServer(app);
/**
 * Compartim en un unic servidor el servidor http i WebSocket.
 */
const wss = new ws_1.WebSocketServer({ server: servidorHttp });
/**
 * Creem la constant global per establir el port de connexio.
 */
const PORT = 3000;
/* ==============================
   SERVIR FITXERS DEL CLIENT
============================== */
// Ruta absoluta cap a carpeta client
const rutaClient = path_1.default.join(__dirname, "../../client");
// Servir tots fitxers al client
app.use(express_1.default.static(rutaClient));
/**
 * Per a cada connexio de jugador establim una connexio amb websocket.
 */
const jugadors = new Map();
/**
 * En la connexió:
 * Es crea un nou jugador.
 * Se li assigna una ID.
 * Se li assigna un personatge.
 * Se li assigna un color.
 * Es guarda en un Set.
 */
wss.on("connection", (ws) => {
    if (jugadors.size >= 10) {
        ws.close();
        return;
    }
    const index = jugadors.size;
    const nouJugador = {
        id: (0, crypto_1.randomUUID)(),
        nom: "Jugador" + (index + 1),
        x: Math.random() * 800 + index * 50,
        y: Math.random() * 600,
        vida: 100,
        punts: 0,
        tipus: (0, utilitats_1.obtenirPersonatgeAleatori)(),
        color: (0, utilitats_1.obtenirColorAleatori)(),
        preparat: false
    };
    jugadors.set(ws, nouJugador);
    ws.send(JSON.stringify({
        tipus: "identitat",
        id: nouJugador.id
    }));
    /**
     * Depenguent del missatge rebut:
     */
    ws.on("message", (data) => {
        const missatge = JSON.parse(data.toString());
        // Si el missatge es preparat Marca al jugador com preparat.
        if (missatge.tipus === "preparat") {
            nouJugador.preparat = true;
            const totsPreparats = Array.from(jugadors.values())
                .every(j => j.preparat);
            // Si existeixen dos jugadors preparats inicia el compte enrrere.
            if (totsPreparats && jugadors.size >= 2) {
                (0, gestorPartida_js_1.iniciarCompteEnrere)(wss);
            }
        }
        // Si el missatge es moure actualitza la possicio del jugador. 
        if (missatge.tipus === "moure") {
            nouJugador.x = missatge.x;
            nouJugador.y = missatge.y;
        }
        // Si el missatge es atac envia als clients que creein els projectils. 
        if (missatge.tipus === "atac") {
            (0, utilitats_1.enviarATots)(wss, {
                tipus: "nouProjectil",
                x: nouJugador.x,
                y: nouJugador.y,
                dx: missatge.dx,
                dy: missatge.dy,
                color: nouJugador.color,
                autor: nouJugador.id
            });
        }
        // Si el missatge es impacte controlem la vida, els punts i respawn si és mort.
        if (missatge.tipus === "impacte") {
            const objectiu = Array.from(jugadors.values())
                .find(j => j.id === missatge.objectiuId);
            const autor = Array.from(jugadors.values())
                .find(j => j.id === missatge.autorId);
            if (!objectiu || !autor)
                return;
            objectiu.vida -= 5;
            if (objectiu.vida <= 0) {
                objectiu.vida = 100;
                objectiu.x = Math.random() * 800;
                objectiu.y = Math.random() * 600;
                autor.punts += 3;
            }
            else {
                autor.punts += 1;
            }
            (0, utilitats_1.enviarATots)(wss, {
                tipus: "estat",
                jugadors: Array.from(jugadors.values())
            });
        }
        (0, utilitats_1.enviarATots)(wss, {
            tipus: "estat",
            jugadors: Array.from(jugadors.values())
        });
    });
    // Si el missatge es closse, eliminem el jugador, el personatge disponible i el color.
    ws.on("close", () => {
        jugadors.delete(ws);
        (0, utilitats_1.retornarPersonatge)(nouJugador.tipus);
        (0, utilitats_1.retornarColor)(nouJugador.color);
        (0, utilitats_1.enviarATots)(wss, {
            tipus: "estat",
            jugadors: Array.from(jugadors.values())
        });
    });
});
/* ==============================
   INICIAR SERVIDOR
============================== */
servidorHttp.listen(PORT, () => {
    console.log(`Servidor actiu a http://0.0.0.0:${PORT}`);
});
