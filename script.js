const WHATSAPP_PIZZARIA = "5511999999999"; 

// 🎯 CONFIGURAÇÃO DOS LIMITES
const CONFIG_EXIBICAO = {
    "pizzas": 5,   // Mostra 5 pizzas por padrão
    "bebidas": 3   // Mostra 3 bebidas por padrão
};

// Guarda quais categorias o usuário clicou para "expandir"
let categoriasExpandidas = [];

const categorias_db = [
    { id: "pizzas", nome: "🍕 Pizzas" },
    { id: "bebidas", nome: "🥤 Bebidas" }
];

// O SEU CARDÁPIO (10 Pizzas + 6 Bebidas para o botão funcionar)
const produtos_db = [
    /* === PIZZAS === */
    { id: 1, categoria: "pizzas", nome: "Pizza Calabresa", descricao: "Molho de tomate, muçarela, calabresa, cebola e orégano.", preco: 45.00, imagem: "assets/pizza-calabresa.jpg" },
    { id: 2, categoria: "pizzas", nome: "Pizza Mussarela", descricao: "Molho de tomate, bastante muçarela, rodelas de tomate e orégano.", preco: 40.00, imagem: "assets/pizza-mussarela.jpg" },
    { id: 3, categoria: "pizzas", nome: "Pizza Marguerita", descricao: "Molho de tomate, muçarela, tomate, parmesão e manjericão.", preco: 42.00, imagem: "assets/pizza-marguerita.jpg" },
    { id: 4, categoria: "pizzas", nome: "Pizza Portuguesa", descricao: "Muçarela, presunto, ovos cozidos, cebola, ervilha.", preco: 48.00, imagem: "assets/pizza-portuguesa.jpg" },
    { id: 5, categoria: "pizzas", nome: "Pizza Frango c/ Catupiry", descricao: "Frango desfiado temperado com o verdadeiro Catupiry.", preco: 47.00, imagem: "assets/pizza-frango-catupiry.jpg" },
    { id: 6, categoria: "pizzas", nome: "Pizza Quatro Queijos", descricao: "Muçarela, provolone, parmesão e gorgonzola derretidos.", preco: 50.00, imagem: "assets/pizza-4queijos.jpg" },
    { id: 7, categoria: "pizzas", nome: "Pizza Baiana", descricao: "Calabresa moída, ovos, pimenta calabresa, cebola.", preco: 46.00, imagem: "assets/pizza-baiana.jpg" },
    { id: 8, categoria: "pizzas", nome: "Pizza Bacon", descricao: "Muçarela, fatias de bacon crocante e orégano.", preco: 48.00, imagem: "assets/pizza-bacon.jpg" },
    { id: 9, categoria: "pizzas", nome: "Pizza Peperoni", descricao: "Muçarela e fatias de peperoni levemente apimentado.", preco: 52.00, imagem: "assets/pizza-peperoni.jpg" },
    { id: 10, categoria: "pizzas", nome: "Pizza Toscana", descricao: "Muçarela, calabresa moída, rodelas de tomate.", preco: 45.00, imagem: "assets/pizza-toscana.jpg" },

    /* === BEBIDAS === */
    { id: 101, categoria: "bebidas", nome: "Coca-Cola 2L", descricao: "Refrigerante gelado.", preco: 14.00, imagem: "assets/coca-cola.jpg" },
    { id: 102, categoria: "bebidas", nome: "Guaraná Antarctica 2L", descricao: "Refrigerante gelado.", preco: 12.00, imagem: "assets/guarana.jpg" },
    { id: 103, categoria: "bebidas", nome: "Coca-Cola Lata 350ml", descricao: "Refrigerante lata gelado.", preco: 6.00, imagem: "assets/coca-lata.jpg" },
    { id: 104, categoria: "bebidas", nome: "Fanta Laranja 2L", descricao: "Refrigerante gelado.", preco: 12.00, imagem: "assets/fanta.jpg" },
    { id: 105, categoria: "bebidas", nome: "Guaraná Lata 350ml", descricao: "Refrigerante lata gelado.", preco: 6.00, imagem: "assets/guarana-lata.jpg" },
    { id: 106, categoria: "bebidas", nome: "Água Mineral 500ml", descricao: "Água sem gás.", preco: 4.00, imagem: "assets/agua.jpg" }
];

let carrinho = [];
let produtoAtualModal = null;
let qtdAtualModal = 1;

document.addEventListener("DOMContentLoaded", () => {
    renderizarCategorias();
    renderizarProdutos();
});

// NAVEGAÇÃO DE CATEGORIAS
function renderizarCategorias() {
    const nav = document.getElementById("category-nav");
    nav.innerHTML = "";
    
    categorias_db.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "cat-btn";
        btn.innerText = cat.nome;
        btn.onclick = (e) => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const section = document.getElementById(`secao-${cat.id}`);
            if(section) {
                const y = section.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        };
        nav.appendChild(btn);
    });
}

// 🎯 LÓGICA DO BOTÃO VER MAIS / RECOLHER
function toggleCategoria(idCategoria) {
    if (categoriasExpandidas.includes(idCategoria)) {
        // Se estava expandido, remove da lista (recolhe)
        categoriasExpandidas = categoriasExpandidas.filter(cat => cat !== idCategoria);
        
        // Rola a tela suavemente de volta para o título da categoria
        const section = document.getElementById(`secao-${idCategoria}`);
        if(section) {
            const y = section.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({top: y, behavior: 'smooth'});
        }
    } else {
        // Adiciona na lista (expande)
        categoriasExpandidas.push(idCategoria);
    }
    
    // Atualiza a tela mantendo a pesquisa (se houver)
    const buscaAtual = document.getElementById("input-busca").value;
    renderizarProdutos(buscaAtual);
}

// RENDERIZAÇÃO DOS PRODUTOS
function renderizarProdutos(filtro = "") {
    const container = document.getElementById("produtos-container");
    container.innerHTML = "";

    const estaBuscando = filtro.trim() !== "";

    categorias_db.forEach(cat => {
        const produtosDaCategoria = produtos_db.filter(p => 
            p.categoria === cat.id && 
            (p.nome.toLowerCase().includes(filtro.toLowerCase()) || p.descricao.toLowerCase().includes(filtro.toLowerCase()))
        );

        if (produtosDaCategoria.length > 0) {
            const section = document.createElement("section");
            section.className = "categoria-section";
            section.id = `secao-${cat.id}`;
            section.innerHTML = `<h2 class="categoria-titulo">${cat.nome}</h2>`;
            
            const grid = document.createElement("div");
            grid.className = "grid-produtos";

            // DEFININDO QUANTOS PRODUTOS APARECEM
            const limite = CONFIG_EXIBICAO[cat.id] || 10;
            const isExpandido = categoriasExpandidas.includes(cat.id);
            
            let produtosExibidos = produtosDaCategoria;
            
            // Se NÃO estiver buscando e NÃO estiver expandido, corta a lista no limite
            if (!estaBuscando && !isExpandido && produtosDaCategoria.length > limite) {
                produtosExibidos = produtosDaCategoria.slice(0, limite);
            }

            // GERA OS CARDS
            produtosExibidos.forEach(produto => {
                let precoDisplay = produto.preco > 0 ? `R$ ${produto.preco.toFixed(2).replace('.', ',')}` : "Sob consulta";
                
                grid.innerHTML += `
                    <div class="card-produto" onclick="abrirProduto(${produto.id})">
                        <div class="card-img-container">
                            <img class="card-img" src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'130\\' height=\\'130\\'><rect width=\\'130\\' height=\\'130\\' fill=\\'%232a2a2a\\'/><text x=\\'50%\\' y=\\'50%\\' font-family=\\'Arial\\' font-size=\\'12\\' text-anchor=\\'middle\\' fill=\\'%23666\\' dy=\\'.3em\\'>Sem Foto</text></svg>'">
                        </div>
                        <div class="card-info">
                            <div>
                                <h3 class="card-titulo">${produto.nome}</h3>
                                <p class="card-desc">${produto.descricao}</p>
                            </div>
                            <div class="card-preco-btn">
                                <span class="card-preco">${precoDisplay}</span>
                                <button class="btn-add">+</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            // GERA O BOTÃO VER MAIS / RECOLHER SE NECESSÁRIO
            if (!estaBuscando && produtosDaCategoria.length > limite) {
                if (isExpandido) {
                    grid.innerHTML += `<button class="btn-ver-mais" onclick="toggleCategoria('${cat.id}')">⬆️ Recolher Lista</button>`;
                } else {
                    const restante = produtosDaCategoria.length - limite;
                    grid.innerHTML += `<button class="btn-ver-mais" onclick="toggleCategoria('${cat.id}')">⬇️ Ver mais ${restante} opções</button>`;
                }
            }

            section.appendChild(grid);
            container.appendChild(section);
        }
    });
}

function buscarProdutos(termo) { renderizarProdutos(termo); }

// --- MODAIS E CARRINHO (IGUAL AO CÓDIGO ANTERIOR) ---

function abrirProduto(id) {
    produtoAtualModal = produtos_db.find(p => p.id === id);
    if (!produtoAtualModal) return;

    qtdAtualModal = 1;
    document.getElementById("modal-img").src = produtoAtualModal.imagem;
    
    document.getElementById("modal-img").onerror = function() {
        this.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='200'><rect width='100%' height='200' fill='%232a2a2a'/><text x='50%' y='50%' font-family='Arial' font-size='16' text-anchor='middle' fill='%23666' dy='.3em'>Sem Imagem</text></svg>";
    }

    document.getElementById("modal-nome").innerText = produtoAtualModal.nome;
    document.getElementById("modal-desc").innerText = produtoAtualModal.descricao;
    document.getElementById("modal-preco").innerText = produtoAtualModal.preco > 0 ? `R$ ${produtoAtualModal.preco.toFixed(2).replace('.', ',')}` : "Preço sob consulta";
    
    atualizarPrecoBotaoModal();
    document.getElementById("modal-produto").classList.remove("hidden");
}

function alterarQtdModal(valor) {
    if (qtdAtualModal + valor >= 1) {
        qtdAtualModal += valor;
        atualizarPrecoBotaoModal();
    }
}

function atualizarPrecoBotaoModal() {
    document.getElementById("modal-qtd").innerText = qtdAtualModal;
    if (produtoAtualModal.preco > 0) {
        const total = produtoAtualModal.preco * qtdAtualModal;
        document.getElementById("modal-btn-preco").innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    } else {
        document.getElementById("modal-btn-preco").innerText = `Adicionar`;
    }
}

function fecharModal(idModal) { document.getElementById(idModal).classList.add("hidden"); }

function adicionarAoCarrinho() {
    const itemExistente = carrinho.find(i => i.id === produtoAtualModal.id);
    if (itemExistente) {
        itemExistente.quantidade += qtdAtualModal;
    } else {
        carrinho.push({ ...produtoAtualModal, quantidade: qtdAtualModal });
    }
    fecharModal("modal-produto");
    atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
    const qtdTotal = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    const valorTotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    document.getElementById("cart-count-header").innerText = qtdTotal;

    const bottomBar = document.getElementById("bottom-cart-bar");
    if (qtdTotal > 0) {
        bottomBar.classList.remove("hidden");
        document.getElementById("bottom-cart-count").innerText = `🛒 ${qtdTotal} item(s)`;
        document.getElementById("bottom-cart-total").innerText = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    } else {
        bottomBar.classList.add("hidden");
    }

    const containerItens = document.getElementById("carrinho-itens");
    containerItens.innerHTML = "";

    carrinho.forEach((item, index) => {
        let precoTexto = item.preco > 0 ? `R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}` : "Sob consulta";
        containerItens.innerHTML += `
            <div class="carrinho-item">
                <div class="carrinho-item-info">
                    <h4>${item.nome}</h4>
                    <span class="carrinho-item-preco">${precoTexto}</span>
                </div>
                <div class="qtd-control">
                    <button onclick="alterarItemCarrinho(${index}, -1)">-</button>
                    <span>${item.quantidade}</span>
                    <button onclick="alterarItemCarrinho(${index}, 1)">+</button>
                </div>
            </div>
        `;
    });

    document.getElementById("carrinho-subtotal").innerText = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
}

function alterarItemCarrinho(index, valor) {
    if (carrinho[index].quantidade + valor >= 1) carrinho[index].quantidade += valor;
    else carrinho.splice(index, 1);
    
    atualizarInterfaceCarrinho();
    if (carrinho.length === 0) fecharModal("modal-carrinho");
}

function abrirCarrinho() {
    if (carrinho.length > 0) document.getElementById("modal-carrinho").classList.remove("hidden");
}

function enviarWhatsApp(event) {
    event.preventDefault(); 
    const nome = document.getElementById("cliente-nome").value;
    const obs = document.getElementById("cliente-obs").value;

    let textoPedido = `🍕 *NOVO PEDIDO DE PIZZA*\n\n`;
    textoPedido += `👤 *Cliente:* ${nome}\n\n`;
    textoPedido += `📝 *RESUMO DO PEDIDO:*\n`;

    let subtotal = 0;
    carrinho.forEach(item => {
        if(item.preco > 0) {
            const totalItem = item.preco * item.quantidade;
            subtotal += totalItem;
            textoPedido += `${item.quantidade}x ${item.nome} — R$ ${totalItem.toFixed(2).replace('.', ',')}\n`;
        } else {
            textoPedido += `${item.quantidade}x ${item.nome} — Sob Consulta\n`;
        }
    });

    textoPedido += `\n💵 *Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    
    if (obs) {
        textoPedido += `\n⚠️ *Observação:*\n${obs}\n`;
    }

    textoPedido += `\nOlá! Gostaria de fechar esse pedido. Qual o valor da entrega para o meu endereço?`;
    const url = `https://wa.me/${WHATSAPP_PIZZARIA}?text=${encodeURIComponent(textoPedido)}`;
    window.open(url, '_blank');
    fecharModal("modal-carrinho");
}