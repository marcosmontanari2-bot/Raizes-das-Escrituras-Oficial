module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
    
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Chave da API ausente.' });


        const sentimento = req.body?.sentimento || req.body?.tema || 'Paz';
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: 'Você é um conselheiro bíblico.' },
                    { role: 'user', content: 'Responda apenas com um versículo bíblico e uma pequena frase de consolo para: ' + sentimento }
                ]
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Erro na API do Groq');

        res.status(200).json({ 
            versiculo: data.choices[0].message.content,
            resultado: data.choices[0].message.content
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};