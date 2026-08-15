module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Chave da API ausente.' });

        const tema = req.body?.tema || req.body?.sentimento || "Paz e Proteção";

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "qwen/qwen3.6-27b",
                messages: [
                    { 
                        role: 'system', 
                        content: 'Você é um intercessor e pastor cristão maduro e acolhedor, escrevendo para o portal Raízes das Escrituras. Crie orações profundas, baseadas na graça e na verdade bíblica. Evite respostas artificiais ou clichês superficiais. Escreva com o coração, em tom de conversa íntima com Deus, trazendo conforto e esperança ao leitor.' 
                    },
                    { 
                        role: 'user', 
                        content: 'Escreva uma oração cristã curta (máximo 3 parágrafos) focada neste tema ou sentimento: ' + tema + '. Seja sincero, poético e confortador. Encerre a oração em nome de Jesus. Não use títulos nem versículos soltos no início.' 
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'Erro na Groq');
        }

        // A tesoura que limpa o pensamento em inglês da IA
        let textoLimpo = data.choices[0].message.content;
        textoLimpo = textoLimpo.replace(/<think>[\s\S]*?<\/think>\n*/gi, '').trim();

        res.status(200).json({ 
            resultado: textoLimpo
        });
        
    } catch (error) {
        console.error("Erro na API de Oração:", error);
        res.status(500).json({ error: error.message });
    }
};