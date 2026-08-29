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
                                content: 'CRITICAL INSTRUCTION: DO NOT under any circumstances output internal thoughts, <think> tags, or English text. Respond ONLY with the final Portuguese text. Você é um intercessor e pastor cristão maduro e acolhedor, escrevendo para o portal Raízes das Escrituras. Crie orações profundas, baseadas na graça e na verdade bíblica. Evite respostas artificiais ou clichês superficiais. Escreva com o coração, em tom de conversa íntima com Deus, trazendo conforto e esperança ao leitor.' 
                            },
                            { 
                                role: 'user', 
                                content: 'Escreva uma oração cristã curta (máximo 3 parágrafos) focada neste tema ou sentimento: ' + (tema || "Paz e Proteção") + '. Seja sincero, poético e confortador. Encerre a oração em nome de Jesus. Não use títulos nem versículos soltos no início.' 
                            }
                        ]
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error?.message || 'Erro na Groq');
                }

                let textoLimpo = data.choices[0].message.content;
                
            
                textoLimpo = textoLimpo.replace(/<think>[\s\S]*?<\/think>\n*/gi, '').trim();
                
                
                if (textoLimpo.includes("Thinking Process:")) {
                    let partes = textoLimpo.split(/Thinking Process:[\s\S]*?(?=\n\n)/i);
                    textoLimpo = partes[partes.length - 1].trim();
                }

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