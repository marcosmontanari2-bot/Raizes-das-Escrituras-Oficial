document.addEventListener('DOMContentLoaded', () => {

    if (!document.getElementById('btn-tema')) {
        const btn = document.createElement('button');
        btn.id = 'btn-tema';
        btn.innerHTML = localStorage.getItem('tema-raizes') === 'escuro' ? '☀️ Claro' : '🌙 Escuro';
        btn.style.cssText = "position: fixed; top: 15px; left: 20px; z-index: 99999; background: #f8fafc; padding: 8px 12px; border-radius: 20px; cursor: pointer; border: 1px solid #cbd5e1; box-shadow: 0 2px 5px rgba(0,0,0,0.1);";
        document.body.appendChild(btn);

        if (localStorage.getItem('tema-raizes') === 'escuro') document.body.classList.add('dark-mode');

        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('tema-raizes', isDark ? 'escuro' : 'claro');
            btn.innerHTML = isDark ? '☀️ Claro' : '🌙 Escuro';
        });
    }

    
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        
        if (!document.getElementById('install-banner')) {
            const banner = document.createElement('div');
            banner.id = 'install-banner';
            banner.style.cssText = "position:fixed; bottom:0; left:0; width:100%; background:#2e4a3b; color:white; padding:15px; text-align:center; z-index:100000; box-shadow:0 -4px 10px rgba(0,0,0,0.2);";
            banner.innerHTML = '📲 Instale o App para acesso rápido! <button id="btn-instalar" style="margin-left:10px; background:white; border:none; padding:5px 10px; cursor:pointer;">Instalar</button>';
            document.body.appendChild(banner);
            
            document.getElementById('btn-instalar').addEventListener('click', () => {
                deferredPrompt.prompt();
                banner.style.display = 'none';
            });
        }
    });
});