function calcularNivel(xp) {
    return Math.floor(Number(xp ?? 0) / 100) + 1;
}

export default calcularNivel;