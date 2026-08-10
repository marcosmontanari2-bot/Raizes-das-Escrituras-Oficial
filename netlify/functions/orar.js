exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  try {
    const corpo = JSON.parse(event.body);
    const sentimento = corpo.sentimento;
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
            content: "Você é um sábio conselheiro e intercessor cristão compassivo. O usuário dirá o que está sentindo ou pelo que está passando. Escreva uma oração em primeira pessoa (como se o próprio usuário estivesse falando com Deus) que seja reconfortante, baseada em princípios bíblicos e que o ajude a expressar essa dor ou alegria. A oração deve ter no máximo 2 ou 3 parágrafos curtos. Não escreva NENHUMA introdução ou explicação (como 'Aqui está a oração'). Entregue APENAS o texto da oração e finalize com 'Em nome de Jesus, amém.'"
          },
          {
            role: "user",
            content: sentimento
          }
        ],
        temperature: 0.7
      })
    });

    const dados = await resposta.json();
    const textoOracao = dados.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ oracao: textoOracao })
    };

  } catch (erro) {
    console.error("Erro na função de orar:", erro);
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: "Não foi possível gerar a oração neste momento." })
    };
  }
};