module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Chave da API ausente.' });

        const tema = req.body?.tema || req.body?.sentimento || "Renovação Espiritual";

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
                        content: 'Você é um pastor e escritor cristão maduro, teologicamente profundo e acolhedor, escrevendo para o portal Raízes das Escrituras. Seu objetivo é criar devocionais que tragam esperança real, baseada na graça e na verdade bíblica. Evite respostas que pareçam geradas por IA (como listas, excesso de emojis, ou títulos genéricos). Escreva com o coração, em tom de conversa íntima e pastoral. Seja direto, poético e traga conforto sem usar clichês superficiais.' 
                    },
                    { 
                        role: 'user', 
                        content: 'Escreva um devocional curto (máximo 3 parágrafos curtos) focado neste tema ou sentimento: ' + tema + '. Comece diretamente com um versículo bíblico curto e muito reconfortante. Depois faça a reflexão. Termine com uma oração sincera e simples de no máximo 2 linhas. Não use títulos.' 
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

        res.status(200).json({ 
            devocional: textoLimpo,
            resultado: textoLimpo
        });
        
    } catch (error) {
        console.error("Erro na API de Devocional:", error);
        res.status(500).json({ error: error.message });
    }
};