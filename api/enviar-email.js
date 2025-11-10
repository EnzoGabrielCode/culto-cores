import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request, response) {
  const { emailUsuario, imagemSorteada } = request.body;

  if (!emailUsuario || !imagemSorteada) {
    return response
      .status(400)
      .json({ error: "E-mail e imagem são obrigatórios." });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Ativação Plus <contato@culto-cores.com.br>",
      to: [emailUsuario],
      subject: "Sua Cor Sorteada!",
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

    return response
      .status(200)
      .json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return response.status(500).json({ error: "Erro interno do servidor." });
  }
}
