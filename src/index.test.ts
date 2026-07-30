import { describe, expect, it } from "vitest";
import { calcularDesconto, calcularTotalComDesconto, validarCupom } from "./calculos";

describe("Validação dos cupons", () => {
  it("aceita GELADO10 em compras de R$ 30 ou mais", () => {
    expect(validarCupom("GELADO10", 30)).toBe(true);
  });

  it("recusa GELADO10 em compras abaixo de R$ 30", () => {
    expect(validarCupom("GELADO10", 29.99)).toBe(false);
  });

  it("aceita GELADO15 em compras de R$ 50 ou mais", () => {
    expect(validarCupom("GELADO15", 50)).toBe(true);
  });

  it("recusa GELADO15 em compras abaixo de R$ 50", () => {
    expect(validarCupom("GELADO15", 49.99)).toBe(false);
  });

  it("recusa um cupom inexistente", () => {
    expect(validarCupom("OUTROCUPOM", 100)).toBe(false);
  });
});

describe("Cálculo do desconto", () => {
  it("calcula 10% para o GELADO10", () => {
    expect(calcularDesconto("GELADO10", 40)).toBe(4);
  });

  it("calcula 15% para o GELADO15", () => {
    expect(calcularDesconto("GELADO15", 100)).toBe(15);
  });

  it("não aplica desconto quando o valor mínimo não foi atingido", () => {
    expect(calcularDesconto("GELADO15", 40)).toBe(0);
  });
});

describe("Total da compra", () => {
  it("desconta 10% do valor total", () => {
    expect(calcularTotalComDesconto("GELADO10", 40)).toBe(36);
  });

  it("desconta 15% do valor total", () => {
    expect(calcularTotalComDesconto("GELADO15", 100)).toBe(85);
  });
});
