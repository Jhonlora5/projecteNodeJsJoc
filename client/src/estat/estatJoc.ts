import { JugadorClient } from "../entitats/jugadorClient.js";
import { Projectil } from "../entitats/projectil.js";

/**
 * Aquí guardarem l'estat general del joc, jugadors amb la seva posicio, 
 * nom, colors assignats... projectils direccio, color, posicio...
*/
export const estatJoc = {
    jugadors: [] as JugadorClient[],
    projectils: [] as Projectil[],
    jugadorLocal: null as JugadorClient | null,
    idLocal: null as string | null
};