module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Chave da API ausente.' });

        const tema = req.body?.tema || req.body?.sentimento || "Esperança e Força";

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
                        content: 'Você é um conselheiro cristão maduro e profundo, focado no livro de Salmos, escrevendo para o portal Raízes das Escrituras. Seu objetivo é indicar um trecho de um Salmo e trazer uma breve reflexão de esperança baseada nele. Evite clichês e respostas geradas por IA. Escreva de forma acolhedora e pastoral.' 
                    },
                    { 
                        role: 'user', 
                        content: 'Escolha um trecho curto de um Salmo que traga conforto para este tema ou sentimento: ' + tema + '. Escreva o trecho do Salmo com a referência e, logo abaixo, faça uma reflexão curta (máximo 2 parágrafos) explicando como essa palavra acalma a alma. Não use títulos.' 
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
        console.error("Erro na API de Salmos:", error);
        res.status(500).json({ error: error.message });
    }
};