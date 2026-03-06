/**
 * Realitzem les importacions corresponents:
 * express: Framwork web per servir fitxers.
 * http: Node crea el servidor http base.
 * ws: Llibreria websocket per comunicació en temps real.
 * path: Permet crear rutes absolutes correctes.
 * randomUUID: Genera ID unics per a cada jugador.
 */
import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { randomUUID } from "crypto";

import { Jugador } from "./models/Jugador.js";
import {
    obtenirPersonatgeAleatori,
    obtenirColorAleatori,
    enviarATots,
    retornarPersonatge,
    retornarColor
} from "./joc/utilitats";
import { iniciarCompteEnrere } from "./joc/gestorPartida.js";
/**
 * Creació del servidor express.
 */

const app = express();
const servidorHttp = http.createServer(app);
/**
 * Compartim en un unic servidor el servidor http i WebSocket.
 */
const wss = new WebSocketServer({ server: servidorHttp });
/**
 * Creem la constant global per establir el port de connexio.
 */
const PORT = 3000;

/* ==============================
   SERVIR FITXERS DEL CLIENT
============================== */

// Ruta absoluta cap a carpeta client
const rutaClient = path.join(__dirname, "../../client");

// Servir tots fitxers al client
app.use(express.static(rutaClient));

/**
 * Per a cada connexio de jugador establim una connexio amb websocket.
 */
const jugadors = new Map<WebSocket, Jugador>();


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

    const nouJugador: Jugador = {
        id: randomUUID(),
        nom: "Jugador" + (index + 1),
        x: Math.random() * 800 + index * 50,
        y: Math.random() * 600,
        vida: 100,
        punts: 0,
        tipus: obtenirPersonatgeAleatori(),
        color: obtenirColorAleatori(),
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
                iniciarCompteEnrere(wss);
            }
        }
        // Si el missatge es moure actualitza la possicio del jugador. 
        if (missatge.tipus === "moure") {
            nouJugador.x = missatge.x;
            nouJugador.y = missatge.y;
        }
        // Si el missatge es atac envia als clients que creein els projectils. 
        if (missatge.tipus === "atac") {
            enviarATots(wss, {
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

            if (!objectiu || !autor) return;

            objectiu.vida -= 5;

            if (objectiu.vida <= 0) {
                objectiu.vida = 100;
                objectiu.x = Math.random() * 800;
                objectiu.y = Math.random() * 600;

                autor.punts += 3;
            } else {
                autor.punts += 1;
            }

            enviarATots(wss, {
                tipus: "estat",
                jugadors: Array.from(jugadors.values())
            });
        }

        enviarATots(wss, {
            tipus: "estat",
            jugadors: Array.from(jugadors.values())
        });
    });
    // Si el missatge es closse, eliminem el jugador, el personatge disponible i el color.
    ws.on("close", () => {
        jugadors.delete(ws);
        retornarPersonatge(nouJugador.tipus);
        retornarColor(nouJugador.color);
        enviarATots(wss, {
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