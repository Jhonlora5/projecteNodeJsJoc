export type MissatgeClient =
    | { tipus: "moure"; x: number; y: number }
    | { tipus: "atac"; dx: number; dy: number }
    | { tipus: "preparat" };

export type MissatgeServidor =
    | { tipus: "estat"; jugadors: any[] }
    | { tipus: "compteEnrere"; valor: number }
    | { tipus: "iniciPartida" };