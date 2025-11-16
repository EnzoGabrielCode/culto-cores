import { kv } from "@vercel/kv";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TOTAL_CORES = 7;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Método não permitido" });
  }

  const { emailUsuario } = request.body;
  if (!emailUsuario || !emailUsuario.includes("@")) {
    return response.status(400).json({ error: "E-mail válido é obrigatório." });
  }

  const userKey = `user:${emailUsuario}`;

  try {
    const imagemJaSorteada = await kv.get(userKey);
    if (imagemJaSorteada) {
      return response.status(403).json({
        error: "Este e-mail já participou do sorteio.",
      });
    }

    const chavesContagem = [];
    for (let i = 1; i <= TOTAL_CORES; i++) {
      chavesContagem.push(`count:${i}`);
    }
    const contagens = await kv.mget(chavesContagem);

    let maxCount = 0;
    const contagensTratadas = [];

    for (const count of contagens) {
      const contagemAtual = count || 0;
      contagensTratadas.push(contagemAtual);
      if (contagemAtual > maxCount) {
        maxCount = contagemAtual;
      }
    }
    let pesoTotal = 0;
    const pesosIndividuais = [];

    for (let i = 0; i < contagensTratadas.length; i++) {
      const corNumero = i + 1;
      const contagem = contagensTratadas[i];

      const peso = maxCount - contagem + 1;

      pesoTotal += peso;
      pesosIndividuais.push({ cor: corNumero, peso: peso });
    }

    let ticketSorteado = Math.random() * pesoTotal;
    let corSorteada;

    for (const { cor, peso } of pesosIndividuais) {
      if (ticketSorteado < peso) {
        corSorteada = cor;
        break;
      }
      ticketSorteado -= peso;
    }
    if (!corSorteada) {
      corSorteada = pesosIndividuais[pesosIndividuais.length - 1].cor;
    }

    const chaveContagemSorteada = `count:${corSorteada}`;

    await kv.incr(chaveContagemSorteada);

    const urlCompletaImagem = `https://culto-cores.com.br/assets/img/versiculos/${corSorteada}.png`;

    await kv.set(userKey, urlCompletaImagem);

    await resend.emails.send({
      from: "Ativação Plus <contato@culto-cores.com.br>",
      to: [emailUsuario],
      subject: "Sua Cor Sorteada!",
      html: `
        <h1>Olá!</h1>
        <p>Aqui está a sua cor/versículo sorteado:</p>
        <img src="${urlCompletaImagem}" alt="Versículo Sorteado" style="width:100%; max-width:600px;" />
        <br>
        <p>Equipe Ativação Plus.</p>
      `,
    });

    return response.status(200).json({ imagePath: urlCompletaImagem });
  } catch (error) {
    console.error("Erro no sorteio:", error);
    return response
      .status(500)
      .json({ error: "Erro interno do servidor. Tente novamente." });
  }
}
