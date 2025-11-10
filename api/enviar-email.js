// api/enviar-email.js (O Backend)

// Importa a biblioteca do Resend
import { Resend } from "resend";

// Pega sua Chave da API (que vamos salvar na Vercel)
const resend = new Resend(process.env.RESEND_API_KEY);

// Esta é a função que a Vercel vai executar
export default async function handler(request, response) {
  // 1. Pega o e-mail e a imagem que o frontend enviou
  const { emailUsuario, imagemSorteada } = request.body;

  if (!emailUsuario || !imagemSorteada) {
    return response
      .status(400)
      .json({ error: "E-mail e imagem são obrigatórios." });
  }

  // 2. Monta o e-mail
  try {
    const { data, error } = await resend.emails.send({
      // Mude para o seu e-mail verificado no Resend
      from: "Seu Nome <email@seudominio.com>",
      to: [emailUsuario], // O e-mail do usuário
      subject: "Sua Cor Sorteada!",
      // O corpo do e-mail em HTML
      html: `
        <h1>Olá!</h1>
        <p>Aqui está a sua cor/versículo sorteado:</p>
        <img src="${imagemSorteada}" alt="Versículo Sorteado" style="width:100%; max-width:600px;" />
        <br>
        <p>Equipe Ativação Plus.</p>
      `,
    });

    if (error) {
      console.error("Erro do Resend:", error);
      return response.status(500).json({ error: "Erro ao enviar o e-mail." });
    }

    // 3. Responde para o frontend que deu certo
    return response
      .status(200)
      .json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return response.status(500).json({ error: "Erro interno do servidor." });
  }
}
