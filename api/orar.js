export const config = { runtime: 'edge' };

export default async function (request) {
  if (request.method !== "POST") return new Response("Método não permitido", { status: 405 });
  try {
    const corpo = await request.json();
    const pedido = corpo.pedido || "Uma oração de paz e direção";
    const apiKey = process.env.GROQ_API_KEY;

    const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "Você é um intercessor cristão compassivo. Escreva uma oração personalizada, tocante e cheia de fé baseada no pedido do usuário." },
          { role: "user", content: pedido }
        ],
        temperature: 0.7
      })
    });
    const dados = await resposta.json();
    const oracaoIA = dados.choices[0].message.content;
    return new Response(JSON.stringify({ oracao: oracaoIA }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (erro) {
    return new Response(JSON.stringify({ erro: "Não foi possível gerar a oração neste momento." }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}