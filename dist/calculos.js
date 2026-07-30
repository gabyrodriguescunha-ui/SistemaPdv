export function calcularSubtotal(itens) {
    return itens.reduce(function (subtotal, item) {
        return subtotal + item.preco * item.quantidade;
    }, 0);
}
export function validarCupom(codigo, valorTotal) {
    const cupom = codigo.trim().toUpperCase();
    if (cupom === "GELADO10") {
        return valorTotal >= 30;
    }
    if (cupom === "GELADO15") {
        return valorTotal >= 50;
    }
    return false;
}
export function obterPercentualCupom(codigo, subtotal) {
    const cupom = codigo.trim().toUpperCase();
    if (cupom === "GELADO10" && subtotal >= 30) {
        return 0.1;
    }
    if (cupom === "GELADO15" && subtotal >= 50) {
        return 0.15;
    }
    return 0;
}
export function calcularDesconto(codigoOuSubtotal, valorOuPercentual) {
    if (typeof codigoOuSubtotal === "number") {
        return codigoOuSubtotal * valorOuPercentual;
    }
    const percentual = obterPercentualCupom(codigoOuSubtotal, valorOuPercentual);
    return valorOuPercentual * percentual;
}
export function calcularTotal(subtotal, desconto) {
    return subtotal - desconto;
}
export function calcularTotalComDesconto(codigo, valorTotal) {
    const desconto = calcularDesconto(codigo, valorTotal);
    return valorTotal - desconto;
}
//# sourceMappingURL=calculos.js.map