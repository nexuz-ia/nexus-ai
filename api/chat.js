export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'A variável OPENAI_API_KEY não está configurada na Vercel.' });
  }

  try {
    const { message } = req.body || {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Escreva uma mensagem.' });
    }
    if (message.length > 12000) {
      return res.status(413).json({ error: 'A mensagem é muito longa.' });
    }

    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        instructions: 'Você é o NEXUS, um assistente útil, claro e amigável. Responda em português quando o usuário escrever em português.',
        input: message,
        max_output_tokens: 900
      })
    });

    const result = await upstream.json();
    if (!upstream.ok) {
      const detail = result?.error?.message || 'O provedor de IA retornou um erro.';
      return res.status(upstream.status).json({ error: detail });
    }

    const reply = (result.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === 'output_text')
      .map(part => part.text)
      .join('\n')
      .trim();

    return res.status(200).json({ reply: reply || 'Não consegui gerar uma resposta agora.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao conversar com a OpenAI.' });
  }
}
