import { connexio, enviarMissatge } from "./xarxa/connexio.js";
import { estatJoc } from "./estat/estatJoc.js";
import { inicialitzarEntrada, teclesPremudes } from "./entrada.js";
import { carregarImatges } from "./recursos.js";
import { dibuixar } from "./renderitzador.js";

const canvas = document.getElementById("joc") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight;

carregarImatges();
inicialitzarEntrada();


canvas.addEventListener("mousedown", (event) => {

    if (event.button !== 0) return; // només clic esquerre

    const jugador = estatJoc.jugadorLocal;
    if (!jugador) return;

    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const dx = mouseX - jugador.x;
    const dy = mouseY - jugador.y;

    enviarMissatge({
        tipus: "atac",
        dx,
        dy
    });

});

// ==============================
// BOTÓ PREPARAT (LOBBY)
// ==============================

const botoPreparat = document.getElementById("botoPreparat");

if (botoPreparat) {
    botoPreparat.addEventListener("click", () => {

        enviarMissatge({
            tipus: "preparat"
        });

    });
}

connexio.onmessage = (event) => {

    const dades = JSON.parse(event.data);
    console.log("Missatge rebut:", dades);

    if (dades.tipus === "identitat") {
        estatJoc.idLocal = dades.id;
    }

    if (dades.tipus === "estat") {

        estatJoc.jugadors = dades.jugadors;

        if (estatJoc.idLocal)
            estatJoc.jugadorLocal =
                estatJoc.jugadors.find(j => j.id === estatJoc.idLocal) || null;
        
        actualitzarLlistaJugadors();
    }
    // ==============================
    // COMPTE ENRERE
    // ==============================

    if (dades.tipus === "compteEnrere") {

        const div = document.getElementById("compteEnrere");

        if (div)
            div.textContent = dades.valor >= 0 ? dades.valor : "";
    }

    // ==============================
    // INICI PARTIDA
    // ==============================

    if (dades.tipus === "iniciPartida") {

        const menu = document.getElementById("menuInicial");

        if (menu)
            menu.style.display = "none";
    }

    // ==============================
    // CREAR PROJECTIL
    // ==============================

    if (dades.tipus === "nouProjectil") {

        const longitud = Math.sqrt(dades.dx * dades.dx + dades.dy * dades.dy);

        const dx = dades.dx / longitud;
        const dy = dades.dy / longitud;

        estatJoc.projectils.push({
            x: dades.x,
            y: dades.y,
            dx,
            dy,
            velocitat: 8,
            color: dades.color,
            autor: dades.autor
        });
    }

};

function actualitzarMoviment() {

    const jugador = estatJoc.jugadorLocal;
    if (!jugador) return;

    let movX = 0;
    let movY = 0;

    if (teclesPremudes["w"]) movY -= 1;
    if (teclesPremudes["s"]) movY += 1;
    if (teclesPremudes["a"]) movX -= 1;
    if (teclesPremudes["d"]) movX += 1;

    const longitud = Math.sqrt(movX * movX + movY * movY);

    if (longitud > 0) {

        movX /= longitud;
        movY /= longitud;

        jugador.x += movX * 5;
        jugador.y += movY * 5;

        enviarMissatge({
            tipus: "moure",
            x: jugador.x,
            y: jugador.y
        });

    }
}

function actualitzarProjectils() {

    for (let i = estatJoc.projectils.length - 1; i >= 0; i--) {

        const p = estatJoc.projectils[i];

        p.x += p.dx * p.velocitat;
        p.y += p.dy * p.velocitat;

        // col·lisió amb jugadors
        for (const j of estatJoc.jugadors) {

            if (j.id === p.autor) continue;

            const distancia = Math.sqrt(
                (p.x - j.x) ** 2 +
                (p.y - j.y) ** 2
            );

            if (distancia < 35) {

                enviarMissatge({
                    tipus: "impacte",
                    objectiuId: j.id,
                    autorId: p.autor
                });

                estatJoc.projectils.splice(i, 1);
                break;
            }
        }

        if (
            p.x < 0 ||
            p.x > canvas.width ||
            p.y < 0 ||
            p.y > canvas.height
        ) {
            estatJoc.projectils.splice(i, 1);
        }

    }

}

function actualitzarLlistaJugadors() {

    const div = document.getElementById("llistaJugadors");
    if (!div) return;

    div.innerHTML = "";

    estatJoc.jugadors.forEach(j => {

        div.innerHTML +=
        `<p style="color:${j.color}">
            ${j.nom} ❤️ ${j.vida} ⭐ ${j.punts}
        </p>`;

    });

}

function actualitzarJoc() {

    actualitzarMoviment();
    actualitzarProjectils();

    dibuixar(ctx, canvas);

    requestAnimationFrame(actualitzarJoc);
}


actualitzarJoc();
