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
                model: "qwen/qwen3.6-27b"
                messages: [
                    { role: 'system', content: 'Você é um conselheiro cristão acolhedor.' },
                    { role: 'user', content: 'Escreva um devocional cristão curto e inspirador sobre: ' + tema }
                ]
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Erro na Groq');

        res.status(200).json({ 
            devocional: data.choices[0].message.content,
            resultado: data.choices[0].message.content
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};