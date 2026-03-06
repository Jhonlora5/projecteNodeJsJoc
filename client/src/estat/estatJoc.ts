import { JugadorClient } from "../entitats/jugadorClient.js";
import { Projectil } from "../entitats/projectil.js";

export const estatJoc = {
    jugadors: [] as JugadorClient[],
    projectils: [] as Projectil[],
    jugadorLocal: null as JugadorClient | null,
    idLocal: null as string | null
};