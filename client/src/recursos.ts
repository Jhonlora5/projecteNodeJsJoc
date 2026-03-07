/**
 * Gestiona les imatges de cada personatge que tenim a assets. 
 * El nom correspon a una de les imatges.
 */ 
export const imatges: Record<string, HTMLImageElement> = {};

const tipusPersonatges = [
    "mag","barbar","elf","cavaller","arquera",
    "assassi","paladi","nigromant","druida","monjo"
];

export function carregarImatges() {

    tipusPersonatges.forEach(t => {
        const img = new Image();
        img.src = `./assets/${t}.png`;
        imatges[t] = img;
    });

}