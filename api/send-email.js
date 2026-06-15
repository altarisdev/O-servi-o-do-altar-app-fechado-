// api/send-email.js
export default async function handler(req, res) {
  // Garante que só aceita requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Campos nome, email e senha são obrigatórios.' });
  }

  try {
    // Usaremos a API do Resend (uma das ferramentas gratuitas mais fáceis e robustas para a Vercel)
    const respostaResend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Altaris Presbitério <onboarding@resend.dev>', // No plano grátis fica assim, se colocar domínio próprio você altera aqui
        to: email,
        subject: '✨ Suas Credenciais de Acesso - Sistema Altaris',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 12px;">
            <h2 style="color: #92400e; text-align: center;">Salve, ${nome}!</h2>
            <p>Sua conta no **Altaris - Gestão de Acólitos** foi ativada com sucesso pela coordenação.</p>
            <p>Utilize as seguintes credenciais para acessar o cronograma de escalas e o mural de avisos:</p>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace;">
              <p style="margin: 5px 0;"><strong>E-mail:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Senha Provisória:</strong> ${senha}</p>
            </div>

            <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 30px;">
              Paróquia de São Geraldo / Serviço do Altar. <br>
              <i>Este é um e-mail automático. Não responda.</i>
            </p>
          </div>
        `,
      }),
    });

    if (respostaResend.ok) {
      return res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!' });
    } else {
      const erroDados = await respostaResend.json();
      return res.status(500).json({ error: 'Erro retornado pelo provedor de e-mail', detalhes: erroDados });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor ao processar o disparo', detalhes: error.message });
  }
}
