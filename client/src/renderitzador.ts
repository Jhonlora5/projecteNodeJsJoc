import { estatJoc } from "./estat/estatJoc.js";
import { imatges } from "./recursos.js";

export function dibuixar(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Jugadors
    estatJoc.jugadors.forEach(j => {

        const img = imatges[j.tipus];
        if (!img) return;

        ctx.save();

        ctx.translate(j.x, j.y);

        if (j.direccio !== undefined)
            ctx.rotate(j.direccio);

        ctx.beginPath();
        ctx.arc(0,0,40,0,Math.PI*2);
        ctx.strokeStyle = j.color;
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.drawImage(img,-32,-32,64,64);

        ctx.restore();
    });

    // Projectils
    estatJoc.projectils.forEach(p => {

        ctx.beginPath();
        ctx.arc(p.x,p.y,6,0,Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.fill();

    });

}