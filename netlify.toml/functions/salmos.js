exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  try {
    const corpo = JSON.parse(event.body);
    const tema = corpo.tema || "Consolo e Proteção";
    
    const apiKey = process.env.GROQ_API_KEY;

    const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", 
        messages: [
          {
            role: "system",
            content: "Você é um especialista em Salmos bíblicos. Selecione ou elabore um salmo inspirador e reconfortante com base no tema do usuário."
          },
          {
            role: "user",
            content: tema
          }
        ],
        temperature: 0.7 
      })
    });

    const dados = await resposta.json();
    const salmoIA = dados.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salmo: salmoIA })
    };

  } catch (erro) {
    console.error("Erro na função:", erro);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ erro: "Não foi possível buscar o salmo neste momento." })
    };
  }
};