document.addEventListener('DOMContentLoaded', () => {


    if (!document.getElementById('floating-toolbar')) {
        const toolbar = document.createElement('div');
        toolbar.id = 'floating-toolbar';
        toolbar.style.cssText = `
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            z-index: 99999; 
            background: rgba(255, 255, 255, 0.95); 
            backdrop-filter: blur(5px);
            padding: 8px 12px; 
            border-radius: 30px; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.15); 
            border: 1px solid #cbd5e1; 
            display: flex; 
            gap: 10px; 
            align-items: center;
        `;

        const btnStyle = `
            background: #f8fafc; 
            color: #0f172a; 
            width: 40px; 
            height: 40px; 
            border-radius: 50%; 
            cursor: pointer; 
            border: 1px solid #cbd5e1; 
            font-size: 18px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            text-decoration: none;
        `;

        const btnTema = document.createElement('button');
        btnTema.id = 'btn-tema';
        btnTema.innerHTML = localStorage.getItem('tema-raizes') === 'escuro' ? '☀️' : '🌙';
        btnTema.title = 'Alternar Tema';
        btnTema.style.cssText = btnStyle;

        if (localStorage.getItem('tema-raizes') === 'escuro') document.body.classList.add('dark-mode');

        btnTema.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('tema-raizes', isDark ? 'escuro' : 'claro');
            btnTema.innerHTML = isDark ? '☀️' : '🌙';
        });

        const btnProg = document.createElement('a');
        btnProg.id = 'btn-progresso';
        btnProg.href = 'progresso.html';
        btnProg.innerHTML = '📊';
        btnProg.title = 'Meu Progresso de Leitura';
        btnProg.style.cssText = btnStyle;

        const btnFav = document.createElement('a');
        btnFav.id = 'btn-favoritos';
        btnFav.href = 'favoritos.html';
        btnFav.innerHTML = '⭐';
        btnFav.title = 'Meus Favoritos';
        btnFav.style.cssText = btnStyle;

        toolbar.appendChild(btnTema);
        toolbar.appendChild(btnProg);
        toolbar.appendChild(btnFav);
        document.body.appendChild(toolbar);
    }

    const mainElement = document.querySelector('main');
    if (mainElement && !document.getElementById('container-marcar-lido')) {
        const pageKey = window.location.pathname.split('/').pop();
        if (pageKey && pageKey !== 'index.html' && pageKey !== '' && !pageKey.includes('progresso') && !pageKey.includes('favoritos')) {
            
            let lidos = JSON.parse(localStorage.getItem('raizes_lidos') || '[]');
            let jaLido = lidos.includes(pageKey);

            const containerLido = document.createElement('div');
            containerLido.id = 'container-marcar-lido';
            containerLido.style.cssText = "margin: 30px 0 10px 0; text-align: left; padding: 0 15px;";
            
            const btnLido = document.createElement('button');
            btnLido.id = 'btn-marcar-lido';
            btnLido.innerHTML = jaLido ? '✅ Página Concluída (Lido)' : '📖 Marcar página como lida';
            btnLido.style.cssText = jaLido 
                ? "background: #dcfce7; border: 1px solid #22c55e; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 0.95rem; font-weight: bold; color: #166534;"
                : "background: #f1f5f9; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 0.95rem; font-weight: bold; color: #1e293b;";
            
            btnLido.onclick = () => {
                let currentLidos = JSON.parse(localStorage.getItem('raizes_lidos') || '[]');
                if (currentLidos.includes(pageKey)) {
                    currentLidos = currentLidos.filter(p => p !== pageKey);
                    localStorage.setItem('raizes_lidos', JSON.stringify(currentLidos));
                    btnLido.innerHTML = '📖 Marcar página como lida';
                    btnLido.style.background = '#f1f5f9';
                    btnLido.style.color = '#1e293b';
                    btnLido.style.borderColor = '#cbd5e1';
                } else {
                    currentLidos.push(pageKey);
                    localStorage.setItem('raizes_lidos', JSON.stringify(currentLidos));
                    btnLido.innerHTML = '✅ Página Concluída (Lido)';
                    btnLido.style.background = '#dcfce7';
                    btnLido.style.color = '#166534';
                    btnLido.style.borderColor = '#22c55e';
                }
            };

            containerLido.appendChild(btnLido);
            mainElement.appendChild(containerLido);
        }
    }

    const observer = new MutationObserver(() => {
        const resultadoTexto = document.getElementById('resultadoTexto') || document.getElementById('resultado');
        if (resultadoTexto && resultadoTexto.innerText.trim().length > 10 && !document.getElementById('barra-acoes')) {
            
            const barra = document.createElement('div');
            barra.id = 'barra-acoes';
            barra.style.cssText = "margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 15px;";
            
            const btnOuvir = document.createElement('button');
            btnOuvir.innerHTML = '🔊 Ouvir';
            btnOuvir.style.cssText = "background: #f1f5f9; border: 1px solid #cbd5f1; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: bold; color: #1e293b;";
            btnOuvir.onclick = () => {
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    
                    let textoLimpo = resultadoTexto.innerText
                        .replace(/[*#_`~>]/g, '')
                        .replace(/\n+/g, '. ');

                    const utterance = new SpeechSynthesisUtterance(textoLimpo);
                    utterance.lang = 'pt-BR';
                    window.speechSynthesis.speak(utterance);
                }
            };

            const btnWpp = document.createElement('button');
            btnWpp.innerHTML = '📱 Compartilhar';
            btnWpp.style.cssText = "background: #25d366; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: bold;";
            btnWpp.onclick = () => {
                const texto = encodeURIComponent("🌱 Raízes das Escrituras:\n\n" + resultadoTexto.innerText);
                window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
            };

            const btnFav = document.createElement('button');
            btnFav.innerHTML = '⭐ Favoritar';
            btnFav.style.cssText = "background: #fef08a; border: 1px solid #eab308; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: bold; color: #854d0e;";
            btnFav.onclick = () => {
                let favoritos = JSON.parse(localStorage.getItem('raizes_favoritos') || '[]');
                favoritos.push(resultadoTexto.innerText);
                localStorage.setItem('raizes_favoritos', JSON.stringify(favoritos));
                alert('✨ Mensagem salva nos favoritos com sucesso!');
            };

            barra.appendChild(btnOuvir);
            barra.appendChild(btnWpp);
            barra.appendChild(btnFav);
            resultadoTexto.parentNode.appendChild(barra);
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
});