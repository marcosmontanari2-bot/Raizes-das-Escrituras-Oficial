exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  try {
    const corpo = JSON.parse(event.body);
    const tema = corpo.tema || "Paz e Confiança";
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
            content: "Você é um conselheiro espiritual profundo e poético especializado no Livro de Salmos. O usuário enviará um tema ou situação. Crie uma Meditação nos Salmos personalizada e reconfortante, contendo: 1) Um Salmo específico de referência e seus versículos centrais, 2) Uma reflexão poética e acolhedora conectando a poesia dos Salmos ao momento atual do usuário, 3) Uma breve palavra de louvor ou consolo. Formate de maneira limpa, bonita e inspiradora."
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
    const textoMeditacao = dados.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ meditacao: textoMeditacao })
    };

  } catch (erro) {
    console.error("Erro na função de salmos:", erro);
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: "Não foi possível gerar a meditação neste momento." })
    };
  }
};