import { calcularDesconto, calcularSubtotal, calcularTotal, obterPercentualCupom, } from "./calculos";
// Produtos disponíveis
const produtos = [
    {
        id: 1,
        nome: "Casquinha",
        descricao: "Uma bola de sorvete",
        preco: 5,
        imagem: "./imagens/casquinha.png",
    },
    {
        id: 2,
        nome: "Cascão",
        descricao: "Duas bolas de sorvete",
        preco: 8,
        imagem: "./imagens/cascao.png",
    },
    {
        id: 3,
        nome: "Copinho",
        descricao: "Duas bolas no copinho",
        preco: 7,
        imagem: "./imagens/copinho.png",
    },
    {
        id: 4,
        nome: "Sundae",
        descricao: "Sorvete com calda e cobertura",
        preco: 12,
        imagem: "./imagens/sundae.png",
    },
    {
        id: 5,
        nome: "Milk-shake",
        descricao: "Sorvete batido de 400 ml",
        preco: 15,
        imagem: "./imagens/milkshake.png",
    },
    {
        id: 6,
        nome: "Picolé",
        descricao: "Picolé de fruta",
        preco: 4,
        imagem: "./imagens/picole.png",
    },
];
// Guarda os produtos adicionados
const pedido = [];
// Guarda o percentual de desconto
let percentualDesconto = 0;
// Elementos da lista de produtos
const listaProdutos = document.querySelector("#lista-produtos");
// Elementos do pedido
const itensPedido = document.querySelector("#itens-pedido");
const valorSubtotal = document.querySelector("#subtotal");
const valorDesconto = document.querySelector("#desconto");
const valorTotal = document.querySelector("#total");
// Elementos do cupom
const campoCupom = document.querySelector("#codigo-cupom");
const botaoAplicarCupom = document.querySelector("#aplicar-cupom");
const mensagemCupom = document.querySelector("#mensagem-cupom");
// Botão de finalizar
const botaoFinalizar = document.querySelector("#finalizar-pedido");
// Elementos do modal de mensagens
const modalMensagem = document.querySelector("#modal-mensagem");
const modalIcone = document.querySelector("#modal-icone");
const modalTitulo = document.querySelector("#modal-titulo");
const modalTexto = document.querySelector("#modal-texto");
const botaoFecharModal = document.querySelector("#fechar-modal");
// Formata um número como moeda brasileira
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
// Mostra os produtos na página
function mostrarProdutos() {
    if (!listaProdutos) {
        return;
    }
    // Limpa os produtos mostrados anteriormente
    listaProdutos.innerHTML = "";
    produtos.forEach(function (produto) {
        // Cria o card
        const cardProduto = document.createElement("article");
        cardProduto.classList.add("card-produto");
        // Cria a imagem do produto
        const imagemProduto = document.createElement("img");
        imagemProduto.src = produto.imagem;
        imagemProduto.alt = produto.nome;
        imagemProduto.classList.add("imagem-produto");
        // Cria o nome
        const nomeProduto = document.createElement("h3");
        nomeProduto.textContent = produto.nome;
        // Cria a descrição
        const descricaoProduto = document.createElement("p");
        descricaoProduto.textContent = produto.descricao;
        // Cria o preço
        const precoProduto = document.createElement("strong");
        precoProduto.textContent = formatarPreco(produto.preco);
        // Cria o botão Adicionar
        const botaoAdicionar = document.createElement("button");
        botaoAdicionar.type = "button";
        botaoAdicionar.textContent = "Adicionar";
        botaoAdicionar.classList.add("botao-adicionar");
        // Adiciona o produto ao clicar
        botaoAdicionar.addEventListener("click", function () {
            adicionarProduto(produto.id);
        });
        // Coloca os elementos no card
        cardProduto.append(imagemProduto, nomeProduto, descricaoProduto, precoProduto, botaoAdicionar);
        // Coloca o card na página
        listaProdutos.appendChild(cardProduto);
    });
}
// Adiciona um produto ao pedido
function adicionarProduto(idProduto) {
    const produtoEncontrado = produtos.find(function (produto) {
        return produto.id === idProduto;
    });
    if (!produtoEncontrado) {
        return;
    }
    // Verifica se o produto já está no pedido
    const itemExistente = pedido.find(function (item) {
        return item.id === idProduto;
    });
    if (itemExistente) {
        // Aumenta a quantidade
        itemExistente.quantidade += 1;
    }
    else {
        // Adiciona um novo item
        pedido.push({
            id: produtoEncontrado.id,
            nome: produtoEncontrado.nome,
            descricao: produtoEncontrado.descricao,
            preco: produtoEncontrado.preco,
            imagem: produtoEncontrado.imagem,
            quantidade: 1,
        });
    }
    mostrarPedido();
}
// Aumenta a quantidade
function aumentarQuantidade(idProduto) {
    const itemEncontrado = pedido.find(function (item) {
        return item.id === idProduto;
    });
    if (!itemEncontrado) {
        return;
    }
    itemEncontrado.quantidade += 1;
    mostrarPedido();
}
// Diminui a quantidade
function diminuirQuantidade(idProduto) {
    const itemEncontrado = pedido.find(function (item) {
        return item.id === idProduto;
    });
    if (!itemEncontrado) {
        return;
    }
    itemEncontrado.quantidade -= 1;
    // Remove o item quando a quantidade chegar a zero
    if (itemEncontrado.quantidade === 0) {
        removerProduto(idProduto);
        return;
    }
    mostrarPedido();
}
// Remove um produto
function removerProduto(idProduto) {
    const indiceProduto = pedido.findIndex(function (item) {
        return item.id === idProduto;
    });
    if (indiceProduto === -1) {
        return;
    }
    pedido.splice(indiceProduto, 1);
    mostrarPedido();
}
// Verifica se o pedido ainda atende ao valor mínimo do cupom
function verificarRegraCupom(subtotal) {
    if (!mensagemCupom) {
        return;
    }
    if (percentualDesconto === 0.15 && subtotal < 50) {
        percentualDesconto = 0;
        mensagemCupom.textContent =
            "O desconto de 15% foi removido porque o pedido ficou abaixo de R$ 50,00.";
        mensagemCupom.className = "cupom-invalido";
    }
    if (percentualDesconto === 0.1 && subtotal < 30) {
        percentualDesconto = 0;
        mensagemCupom.textContent =
            "O desconto de 10% foi removido porque o pedido ficou abaixo de R$ 30,00.";
        mensagemCupom.className = "cupom-invalido";
    }
}
// Mostra o pedido na página
function mostrarPedido() {
    if (!itensPedido || !valorSubtotal || !valorDesconto || !valorTotal) {
        return;
    }
    // Limpa os itens mostrados
    itensPedido.innerHTML = "";
    // Exibe uma mensagem se o pedido estiver vazio
    if (pedido.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum sorvete adicionado.";
        itensPedido.appendChild(mensagem);
    }
    // Mostra os produtos adicionados
    pedido.forEach(function (item) {
        const elementoPedido = document.createElement("div");
        elementoPedido.classList.add("item-pedido");
        // Informações do produto
        const informacoes = document.createElement("div");
        const nomeProduto = document.createElement("strong");
        nomeProduto.textContent = item.nome;
        const precoUnitario = document.createElement("p");
        precoUnitario.textContent = formatarPreco(item.preco) + " cada";
        informacoes.append(nomeProduto, precoUnitario);
        // Controles de quantidade
        const controleQuantidade = document.createElement("div");
        controleQuantidade.classList.add("controle-quantidade");
        const botaoDiminuir = document.createElement("button");
        botaoDiminuir.type = "button";
        botaoDiminuir.textContent = "−";
        botaoDiminuir.addEventListener("click", function () {
            diminuirQuantidade(item.id);
        });
        const quantidade = document.createElement("span");
        quantidade.textContent = String(item.quantidade);
        const botaoAumentar = document.createElement("button");
        botaoAumentar.type = "button";
        botaoAumentar.textContent = "+";
        botaoAumentar.addEventListener("click", function () {
            aumentarQuantidade(item.id);
        });
        controleQuantidade.append(botaoDiminuir, quantidade, botaoAumentar);
        // Total desse produto
        const totalProduto = document.createElement("strong");
        totalProduto.textContent = formatarPreco(item.preco * item.quantidade);
        // Botão Remover
        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.textContent = "Remover";
        botaoRemover.classList.add("botao-remover");
        botaoRemover.addEventListener("click", function () {
            removerProduto(item.id);
        });
        elementoPedido.append(informacoes, controleQuantidade, totalProduto, botaoRemover);
        itensPedido.appendChild(elementoPedido);
    });
    // Calcula os valores do pedido
    const subtotal = calcularSubtotal(pedido);
    // Confere se o cupom ainda pode continuar aplicado
    verificarRegraCupom(subtotal);
    const desconto = calcularDesconto(subtotal, percentualDesconto);
    const total = calcularTotal(subtotal, desconto);
    // Mostra os valores
    valorSubtotal.textContent = formatarPreco(subtotal);
    valorDesconto.textContent = formatarPreco(desconto);
    valorTotal.textContent = formatarPreco(total);
}
// Aplica o cupom digitado
function aplicarCupom() {
    if (!campoCupom || !mensagemCupom) {
        return;
    }
    // Valor atual da compra
    const subtotal = calcularSubtotal(pedido);
    // Remove espaços e transforma em maiúsculo
    const cupomDigitado = campoCupom.value.trim().toUpperCase();
    const percentualCupom = obterPercentualCupom(cupomDigitado, subtotal);
    if (cupomDigitado === "GELADO10") {
        if (percentualCupom > 0) {
            percentualDesconto = percentualCupom;
            mensagemCupom.textContent = "Cupom de 10% aplicado!";
            mensagemCupom.className = "cupom-valido";
        }
        else {
            percentualDesconto = 0;
            mensagemCupom.textContent = "O cupom GELADO10 exige uma compra mínima de R$ 30,00.";
            mensagemCupom.className = "cupom-invalido";
        }
    }
    else if (cupomDigitado === "GELADO15") {
        if (percentualCupom > 0) {
            percentualDesconto = percentualCupom;
            mensagemCupom.textContent = "Cupom de 15% aplicado!";
            mensagemCupom.className = "cupom-valido";
        }
        else {
            percentualDesconto = 0;
            mensagemCupom.textContent = "O cupom GELADO15 exige uma compra mínima de R$ 50,00.";
            mensagemCupom.className = "cupom-invalido";
        }
    }
    else {
        percentualDesconto = 0;
        mensagemCupom.textContent = "Cupom inválido.";
        mensagemCupom.className = "cupom-invalido";
    }
    // Atualiza os valores
    mostrarPedido();
}
// Exibe uma mensagem personalizada no lugar do alert
function mostrarModal(titulo, mensagem, icone) {
    if (!modalMensagem || !modalIcone || !modalTitulo || !modalTexto) {
        return;
    }
    modalIcone.textContent = icone;
    modalTitulo.textContent = titulo;
    modalTexto.textContent = mensagem;
    modalMensagem.showModal();
}
// Finaliza e limpa o pedido
function finalizarPedido() {
    // Não permite finalizar um pedido vazio
    if (pedido.length === 0) {
        mostrarModal("Pedido vazio", "Adicione pelo menos um sorvete antes de finalizar.", "🍨");
        return;
    }
    // Calcula o total antes de limpar
    const subtotal = calcularSubtotal(pedido);
    const desconto = calcularDesconto(subtotal, percentualDesconto);
    const total = calcularTotal(subtotal, desconto);
    mostrarModal("Pedido finalizado!", "Total da compra: " + formatarPreco(total), "🎉");
    // Remove todos os itens do pedido
    pedido.splice(0, pedido.length);
    // Reinicia o desconto
    percentualDesconto = 0;
    // Limpa o campo do cupom
    if (campoCupom) {
        campoCupom.value = "";
    }
    // Limpa a mensagem do cupom
    if (mensagemCupom) {
        mensagemCupom.textContent = "";
        mensagemCupom.className = "";
    }
    // Atualiza a tela
    mostrarPedido();
}
// Evento do botão Aplicar cupom
botaoAplicarCupom?.addEventListener("click", function () {
    aplicarCupom();
});
// Permite aplicar o cupom apertando Enter
campoCupom?.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
        aplicarCupom();
    }
});
// Evento do botão Finalizar pedido
botaoFinalizar?.addEventListener("click", function () {
    finalizarPedido();
});
// Fecha o modal personalizado
botaoFecharModal?.addEventListener("click", function () {
    modalMensagem?.close();
});
// Inicia o sistema
mostrarProdutos();
mostrarPedido();
//# sourceMappingURL=index.js.map