document.addEventListener("DOMContentLoaded", function () {
    const divConteudo = document.getElementById("conteudo-linguagem-simples");
    const btnLinguagem = document.getElementById("btn-ler-mais") || document.getElementById("btn-ler-genesis") || document.getElementById("btn-ler-exodo");

    if (!divConteudo || !btnLinguagem) return;

    let dadosCarregados = null;
    let menuAberto = false;

    btnLinguagem.addEventListener("click", function (event) {
        event.preventDefault(); // Evita que a página pule

        if (dadosCarregados) {
            menuAberto = !menuAberto;
            divConteudo.style.display = menuAberto ? "block" : "none";
            btnLinguagem.innerHTML = menuAberto ? "📖 Fechar Leitura" : "📖 Ler Livro";
            return;
        }

        btnLinguagem.innerHTML = "⏳ Carregando...";

        // Pega o nome do livro direto do atributo data-livro do botão no HTML
        let nomeLivro = btnLinguagem.getAttribute("data-livro");

        if (!nomeLivro) {
            nomeLivro = btnLinguagem.id === "btn-ler-exodo" ? "exodo" : "genesis";
        }

        const caminhoJson = `dados/linguagem-simples/antigo-testamento/${nomeLivro}.json`;

        // Busca o JSON no caminho correto
        fetch(caminhoJson)
            .then(response => {
                if (!response.ok) throw new Error("Arquivo não encontrado: " + caminhoJson);
                return response.json();
            })
            .then(data => {
                dadosCarregados = data;
                construirInterface(data);
                
                divConteudo.style.display = "block";
                menuAberto = true;
                btnLinguagem.innerHTML = "📖 Fechar Leitura";
            })
            .catch(error => {
                console.error("Erro:", error);
                btnLinguagem.innerHTML = "⚠️ Erro ao carregar";
            });
    });

    function construirInterface(data) {
        const numerosCapitulos = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));

        let html = `
            <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
                <h3 style="font-size: 1.1rem; color: #475569; margin-top: 0; margin-bottom: 5px;">Selecione o Capítulo:</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        `;

        numerosCapitulos.forEach(cap => {
            html += `<button class="btn-capitulo" data-cap="${cap}" style="background-color: #e2e8f0; color: #1e293b; border: none; padding: 8px 14px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: 0.2s;">${cap}</button>`;
        });

        html += `
                </div>
            </div>
            <div id="texto-capitulo-dinamico"></div>
        `;

        divConteudo.innerHTML = html;

        const botoes = divConteudo.querySelectorAll(".btn-capitulo");
        botoes.forEach(btn => {
            btn.addEventListener("click", function() {
                botoes.forEach(b => {
                    b.style.backgroundColor = "#e2e8f0";
                    b.style.color = "#1e293b";
                });
                this.style.backgroundColor = "#2e4a3b";
                this.style.color = "white";

                mostrarTextoDoCapitulo(data[this.getAttribute("data-cap")]);
            });
        });

        if (botoes.length > 0) botoes[0].click();
    }

    function mostrarTextoDoCapitulo(cap) {
        const divTexto = document.getElementById("texto-capitulo-dinamico");
        if (!divTexto) return;
        divTexto.innerHTML = `
            <h2 style="color: #2e4a3b; margin-top: 0;">${cap.referencia}</h2>
            <h3 style="font-size: 1.1rem; color: #1e293b; margin-top: 20px;">O Texto</h3>
            <p style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #cbd5e1; line-height: 1.6;">${cap.texto}</p>
            <h3 style="font-size: 1.1rem; color: #1e293b; margin-top: 20px;">🔍 Contexto</h3>
            <p style="line-height: 1.6;">${cap.contexto}</p>
            <h3 style="font-size: 1.1rem; color: #1e293b; margin-top: 20px;">🎯 Sentido do Texto</h3>
            <p style="line-height: 1.6;">${cap.sentido}</p>
            <h3 style="font-size: 1.1rem; color: #1e293b; margin-top: 20px;">✨ Essência</h3>
            <p style="line-height: 1.6;"><strong>${cap.essencia}</strong></p>
            <h3 style="font-size: 1.1rem; color: #94a3b8; margin-top: 20px;">⚠️ O que o texto não diz</h3>
            <p style="color: #475569; line-height: 1.6;">${cap.o_que_nao_diz}</p>
            <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 30px 0 15px 0;">
            <p style="font-size: 0.75rem; color: #94a3b8; text-align: justify;"><strong>Aviso de Transparência:</strong> Esta é uma obra textual própria do Raízes das Escrituras, desenvolvida para apresentar o conteúdo bíblico em linguagem acessível, buscando preservar o sentido e o contexto dos textos bíblicos. Não se trata de uma tradução oficial de nenhuma edição da Bíblia.</p>
        `;
    }
});