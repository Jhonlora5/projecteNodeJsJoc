// Creem un objecte buit encarregat de guardar les tecles premudes.
export const teclesPremudes: Record<string, boolean> = {};

// Creem una funcio encarregada d'escoltar els esdeveniments de les tecles.
export function inicialitzarEntrada() {

    document.addEventListener("keydown", (e) => {
        teclesPremudes[e.key.toLowerCase()] = true;
    });

    document.addEventListener("keyup", (e) => {
        teclesPremudes[e.key.toLowerCase()] = false;
    });

}