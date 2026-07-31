"use strict";
const formatarMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});
const seletorMes = document.querySelector("#mes-relatorio");
const erroRelatorio = document.querySelector("#erro-relatorio");
let todasAsVendas = [];
function definirTexto(seletor, texto) {
    const elemento = document.querySelector(seletor);
    if (elemento)
        elemento.textContent = texto;
}
function contarPorNome(vendas, obterNome, obterQuantidade = () => 1) {
    const totais = new Map();
    vendas.forEach((venda) => {
        const nome = obterNome(venda);
        if (nome)
            totais.set(nome, (totais.get(nome) ?? 0) + obterQuantidade(venda));
    });
    return Array.from(totais, ([nome, quantidade]) => ({ nome, quantidade })).sort((a, b) => b.quantidade - a.quantidade);
}
function mostrarRanking(ranking) {
    const container = document.querySelector("#ranking-produtos");
    if (!container)
        return;
    container.innerHTML = "";
    const maiorQuantidade = ranking[0]?.quantidade ?? 1;
    ranking.forEach((item, indice) => {
        const linha = document.createElement("div");
        linha.className = "linha-ranking";
        const posicao = document.createElement("span");
        posicao.className = "posicao";
        posicao.textContent = String(indice + 1);
        const nome = document.createElement("strong");
        nome.textContent = item.nome;
        const barraFundo = document.createElement("div");
        barraFundo.className = "barra-fundo";
        const barra = document.createElement("div");
        barra.className = "barra";
        barra.style.width = `${(item.quantidade / maiorQuantidade) * 100}%`;
        barraFundo.appendChild(barra);
        const quantidade = document.createElement("strong");
        quantidade.textContent = String(item.quantidade);
        linha.append(posicao, nome, barraFundo, quantidade);
        container.appendChild(linha);
    });
}
function atualizarRelatorio() {
    const mes = seletorMes?.value ?? "2026-07";
    const vendasDoMes = todasAsVendas.filter((venda) => venda.data.startsWith(mes));
    const rankingProdutos = contarPorNome(vendasDoMes, (venda) => venda.produto, (venda) => venda.quantidade);
    const rankingCupons = contarPorNome(vendasDoMes, (venda) => venda.cupom);
    const rankingPagamentos = contarPorNome(vendasDoMes, (venda) => venda.formaPagamento);
    const maisVendido = rankingProdutos[0];
    const menosVendido = rankingProdutos[rankingProdutos.length - 1];
    const arrecadado = vendasDoMes.reduce((total, venda) => total + venda.total, 0);
    definirTexto("#valor-arrecadado", formatarMoeda.format(arrecadado));
    definirTexto("#total-vendas", vendasDoMes.length.toLocaleString("pt-BR"));
    definirTexto("#mais-vendido", maisVendido?.nome ?? "Sem dados");
    definirTexto("#quantidade-mais-vendido", `${maisVendido?.quantidade ?? 0} unidades`);
    definirTexto("#menos-vendido", menosVendido?.nome ?? "Sem dados");
    definirTexto("#quantidade-menos-vendido", `${menosVendido?.quantidade ?? 0} unidades`);
    definirTexto("#cupom-mais-usado", rankingCupons[0]?.nome ?? "Nenhum cupom utilizado");
    definirTexto("#pagamento-mais-usado", rankingPagamentos[0]?.nome ?? "Sem dados");
    mostrarRanking(rankingProdutos);
}
async function iniciarRelatorio() {
    try {
        const resposta = await fetch("./dados/vendas.json");
        if (!resposta.ok)
            throw new Error("Não foi possível carregar os dados.");
        todasAsVendas = (await resposta.json());
        atualizarRelatorio();
    }
    catch {
        if (erroRelatorio) {
            erroRelatorio.hidden = false;
            erroRelatorio.textContent =
                "Não foi possível abrir o relatório. Execute o projeto por um servidor local ou pelo GitHub Pages.";
        }
    }
}
seletorMes?.addEventListener("change", atualizarRelatorio);
void iniciarRelatorio();
//# sourceMappingURL=relatorio.js.map