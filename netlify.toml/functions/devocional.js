exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  try {
    const corpo = JSON.parse(event.body);
    const tema = corpo.tema || "Fé e Esperança";
    
    
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
            content: "Você é um pastor e escritor cristão sábio. Crie um Devocional Diário profundo e acolhedor baseado nas Escrituras."
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
    const devocionalIA = dados.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devocional: devocionalIA })
    };

  } catch (erro) {
    console.error("Erro na função:", erro);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ erro: "Não foi possível gerar o devocional neste momento." })
    };
  }
};