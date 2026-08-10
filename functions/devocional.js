export async function onRequest(context) {
  const request = context.request;
  
  if (request.method !== "POST") {
    return new Response("Método não permitido", { status: 405 });
  }

  try {
    const corpo = await request.json();
    const tema = corpo.tema || "Fé e Esperança";
    
    const apiKey = context.env.GROQ_API_KEY;

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

    return new Response(JSON.stringify({ devocional: devocionalIA }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (erro) {
    console.error("Erro na função:", erro);
    return new Response(JSON.stringify({ erro: "Não foi possível gerar o devocional neste momento." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};