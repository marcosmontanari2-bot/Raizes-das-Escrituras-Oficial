const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    if (req.url === '/api/buscar' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { tema } = JSON.parse(body);
                const apiKey = process.env.GROQ_API_KEY;

                if (!apiKey) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Chave da API ausente.' }));
                }

                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "llama-3.1-8b-instant",
                        messages: [
                            { 
                                role: 'system', 
                                content: 'Você é um pastor cristão escrevendo para o portal Raízes das Escrituras. REGRA ABSOLUTA: Você deve colocar toda a sua resposta final obrigatoriamente entre as tags <texto> e </texto>. Escreva de forma acolhedora, em português. Não adicione comentários fora da tag.' 
                            },
                            { 
                                role: 'user', 
                                content: 'Escreva a oração ou reflexão final (máximo 3 parágrafos) focada no tema: ' + (tema || "Paz e Proteção") + '. Lembre-se de colocar o texto dentro de <texto> e </texto>.' 
                            }
                        ]
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error?.message || 'Erro na Groq');
                }

                let textoBruto = data.choices[0].message.content;
                let textoLimpo = textoBruto;

            
                const regexTexto = /<texto>([\s\S]*?)<\/texto>/i;
                const match = textoBruto.match(regexTexto);

                if (match && match[1]) {
                    textoLimpo = match[1].trim();
                } else {
                    
                    textoLimpo = textoLimpo.replace(/<think>[\s\S]*?<\/think>/gi, '');
                    textoLimpo = textoLimpo.replace(/.*?Drafting.*?\n/gi, '');
                    if (textoLimpo.includes("Thinking Process:")) {
                        let partes = textoLimpo.split(/Thinking Process:[\s\S]*?(?=\n\n)/i);
                        textoLimpo = partes[partes.length - 1].trim();
                    }
                }

                
                textoLimpo = textoLimpo.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
                textoLimpo = textoLimpo.replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ resultado: textoLimpo }));

            } catch (error) {
                console.error("Erro na API:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': case '.jpeg': contentType = 'image/jpeg'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Arquivo não encontrado</h1>');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor local rodando liso em: http://localhost:${PORT}`);
});