export const teclesPremudes = {};
export function inicialitzarEntrada() {
    document.addEventListener("keydown", (e) => {
        teclesPremudes[e.key.toLowerCase()] = true;
    });
    document.addEventListener("keyup", (e) => {
        teclesPremudes[e.key.toLowerCase()] = false;
    });
}
