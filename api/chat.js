export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'A variável GEMINI_API_KEY não está configurada na Vercel.'
    });
  }

  try {
    const { message } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Escreva uma mensagem.' });
    }

    if (message.length > 12000) {
      return res.status(413).json({ error: 'A mensagem é muito longa.' });
    }

    const upstream = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': process.env.GEMINI_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: 'Você é o NEXUS, um assistente inteligente, útil, claro e amigável. Responda em português quando o usuário escrever em português.'
            }]
          },
          contents: [{
            role: 'user',
            parts: [{ text: message }]
          }],
          generationConfig: {
            maxOutputTokens: 900
          }
        })
      }
    );

    const result = await upstream.json();

    if (!upstream.ok) {
      const detail =
        result?.error?.message || 'O Gemini retornou um erro.';
      return res.status(upstream.status).json({ error: detail });
    }

    const reply = (result.candidates?.[0]?.content?.parts || [])
      .map(part => part.text || '')
      .join('')
      .trim();

    return res.status(200).json({
      reply: reply || 'Não consegui gerar uma resposta agora.'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno ao conversar com o Gemini.'
    });
  }
}
