export const config = { runtime: 'edge' };

export default async function (request) {
  if (request.method !== "POST") return new Response("Método não permitido", { status: 405 });
  try {
    const corpo = await request.json();
    
    const tema = corpo.sentimento || corpo.tema || corpo.texto || corpo.palavra || "fé e esperança";
    
    const apiKey = process.env.GROQ_API_KEY;

    const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "Você é um conselheiro devocional cristão. Escreva um devocional diário curto, inspirador e edificante com base no tema ou sentimento enviado pelo usuário." },
          { role: "user", content: tema }
        ],
        temperature: 0.7
      })
    });
    const dados = await resposta.json();
    const devocionalIA = dados.choices[0].message.content;
    return new Response(JSON.stringify({ devocional: devocionalIA }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (erro) {
    return new Response(JSON.stringify({ erro: "Não foi possível gerar o devocional neste momento." }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}