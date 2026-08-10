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
            content: "Você é um pastor e escritor cristão sábio. Crie um Devocional Diário profundo e acolhedor baseado no tema enviado pelo usuário. O devocional deve conter: 1) Um título inspirador, 2) Um versículo-chave (tradução NVI e referência), 3) Uma reflexão curta de 1 ou 2 parágrafos, 4) Uma oração curta de encerramento. Formate de maneira limpa, bonita e organizada."
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
    const textoDevocional = dados.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ devocional: textoDevocional })
    };

  } catch (erro) {
    console.error("Erro na função de devocional:", erro);
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: "Não foi possível gerar o devocional neste momento." })
    };
  }
};