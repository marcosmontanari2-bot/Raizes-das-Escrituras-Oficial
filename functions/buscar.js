export async function onRequest(context) {
  const request = context.request;
  
  if (request.method !== "POST") {
    return new Response("Método não permitido", { status: 405 });
  }

  try {
    const corpo = await request.json();
    const sentimento = corpo.sentimento;
    
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
            content: "Você é um sábio conselheiro bíblico. O usuário dirá o que está sentindo. Retorne APENAS um único versículo bíblico da tradução NVI que conforte, oriente ou encoraje essa pessoa, seguido da referência bíblica. Exemplo do formato desejado: 'O Senhor é o meu pastor; de nada terei falta.' - Salmos 23:1. Não escreva mais nenhuma palavra, introdução ou explicação. Apenas o versículo e a referência."
          },
          {
            role: "user",
            content: sentimento
          }
        ],
        temperature: 0.6 
      })
    });

    const dados = await resposta.json();
    const versiculoIA = dados.choices[0].message.content;

    return new Response(JSON.stringify({ versiculo: versiculoIA }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (erro) {
    console.error("Erro na função:", erro);
    return new Response(JSON.stringify({ erro: "Não foi possível buscar a Palavra neste momento." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};