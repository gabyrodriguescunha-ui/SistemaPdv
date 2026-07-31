import { fakerPT_BR as faker } from "@faker-js/faker";
import fs from "node:fs";

const produtos = [
  { id: 1, nome: "Casquinha", preco: 5 },
  { id: 2, nome: "Cascão", preco: 8 },
  { id: 3, nome: "Copinho", preco: 7 },
  { id: 4, nome: "Sundae", preco: 12 },
  { id: 5, nome: "Milk-shake", preco: 15 },
  { id: 6, nome: "Picolé", preco: 4 },
];

const formasPagamento = ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"];

const cupons = ["GELADO10", "GELADO15", null, null, null];

function gerarVenda() {
  const produto = faker.helpers.arrayElement(produtos);
  const quantidade = faker.number.int({
    min: 1,
    max: 5,
  });

  const subtotal = produto.preco * quantidade;

  let cupom = faker.helpers.arrayElement(cupons);

  // Confere as condições dos cupons
  if (cupom === "GELADO10" && subtotal < 30) {
    cupom = null;
  }

  if (cupom === "GELADO15" && subtotal < 50) {
    cupom = null;
  }

  let percentualDesconto = 0;

  if (cupom === "GELADO10") {
    percentualDesconto = 0.1;
  }

  if (cupom === "GELADO15") {
    percentualDesconto = 0.15;
  }

  const desconto = subtotal * percentualDesconto;
  const total = subtotal - desconto;

  return {
    id: faker.string.uuid(),

    data: faker.date
      .between({
        from: "2026-07-01",
        to: "2026-07-31",
      })
      .toISOString(),

    produto: produto.nome,
    quantidade: quantidade,
    precoUnitario: produto.preco,
    subtotal: subtotal,
    cupom: cupom,

    formaPagamento: faker.helpers.arrayElement(formasPagamento),

    total: Number(total.toFixed(2)),
  };
}

const vendas = [];

for (let contador = 0; contador < 600; contador++) {
  vendas.push(gerarVenda());
}

fs.mkdirSync("./dados", {
  recursive: true,
});

fs.writeFileSync("./dados/vendas.json", JSON.stringify(vendas, null, 2));

console.log("600 vendas falsas foram geradas!");
