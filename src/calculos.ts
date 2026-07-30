export interface ItemCalculavel {
  preco: number;
  quantidade: number;
}

export function calcularSubtotal(itens: ItemCalculavel[]): number {
  return itens.reduce(function (subtotal, item) {
    return subtotal + item.preco * item.quantidade;
  }, 0);
}

export function validarCupom(codigo: string, valorTotal: number): boolean {
  const cupom = codigo.trim().toUpperCase();

  if (cupom === "GELADO10") {
    return valorTotal >= 30;
  }

  if (cupom === "GELADO15") {
    return valorTotal >= 50;
  }

  return false;
}

export function obterPercentualCupom(codigo: string, subtotal: number): number {
  const cupom = codigo.trim().toUpperCase();

  if (cupom === "GELADO10" && subtotal >= 30) {
    return 0.1;
  }

  if (cupom === "GELADO15" && subtotal >= 50) {
    return 0.15;
  }

  return 0;
}

export function calcularDesconto(codigo: string, valorTotal: number): number;
export function calcularDesconto(subtotal: number, percentual: number): number;
export function calcularDesconto(
  codigoOuSubtotal: string | number,
  valorOuPercentual: number,
): number {
  if (typeof codigoOuSubtotal === "number") {
    return codigoOuSubtotal * valorOuPercentual;
  }

  const percentual = obterPercentualCupom(codigoOuSubtotal, valorOuPercentual);

  return valorOuPercentual * percentual;
}

export function calcularTotal(subtotal: number, desconto: number): number {
  return subtotal - desconto;
}

export function calcularTotalComDesconto(codigo: string, valorTotal: number): number {
  const desconto = calcularDesconto(codigo, valorTotal);

  return valorTotal - desconto;
}
