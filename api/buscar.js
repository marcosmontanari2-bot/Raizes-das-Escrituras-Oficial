module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Chave da API ausente.' });

        const tema = req.body?.tema || req.body?.query || req.body?.busca || "Como encontrar paz em Deus?";

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
                        content: 'CRITICAL INSTRUCTION: DO NOT under any circumstances output internal thoughts, <think> tags, or English text. Respond ONLY with the final Portuguese text. Você é um conselheiro cristão e estudioso da Bíblia maduro e acolhedor, respondendo a dúvidas para o portal Raízes das Escrituras. Seu objetivo é trazer clareza bíblica, esperança e orientação prática baseada na Palavra de Deus. Evite respostas engessadas ou que pareçam geradas por IA (como listas excessivas ou títulos genéricos). Seja direto, empático e responda com profundidade pastoral e linguagem natural.' 
                    },
                    { 
                        role: 'user', 
                        content: 'Responda a esta busca ou dúvida com sabedoria bíblica: ' + tema + '. Inclua pelo menos uma referência bíblica curta que embase sua resposta. Mantenha a resposta concisa (máximo 3 parágrafos curtos) para não cansar o leitor. Não use títulos no início.' 
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
            resultado: textoLimpo
        });
        
    } catch (error) {
        console.error("Erro na API de Busca:", error);
        res.status(500).json({ error: error.message });
    }
};