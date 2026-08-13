export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { tema } = req.body;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content: 'Escreva um devocional cristão curto e inspirador sobre: ' + tema }]
        })
    });
    const data = await response.json();
    res.status(200).json({ devocional: data.choices[0].message.content });
}