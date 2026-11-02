NEXUS AI — pacote inicial para Vercel

O QUE JÁ ESTÁ CONFIGURADO
- Interface responsiva do NEXUS AI.
- Cadastro e login por e-mail/senha via Supabase Auth.
- Projeto Supabase e chave pública (publishable) configurados no index.html.
- A chave pública é apropriada para o navegador; nunca coloque uma Secret key no HTML.

COMO PUBLICAR
1. Extraia este ZIP no seu dispositivo.
2. Crie uma conta ou entre em https://github.com
3. Crie um repositório novo chamado nexus-ai.
4. Envie os arquivos index.html e vercel.json para esse repositório.
5. Entre em https://vercel.com, escolha Add New -> Project e importe o repositório nexus-ai.
6. Em Framework Preset, escolha Other. Não precisa preencher Build Command nem Output Directory.
7. Toque em Deploy.
8. Depois de publicado, no Supabase abra Authentication -> URL Configuration.
9. Em Site URL, coloque o endereço HTTPS que a Vercel forneceu. Adicione também esse mesmo endereço em Redirect URLs.
10. Teste o cadastro e confirme o e-mail, se a confirmação estiver ativada.

IMPORTANTE
- Este pacote ativa somente a autenticação do Supabase.
- Chat com IA, memória persistente e geração de imagens ainda não estão implementados.
- Para esses recursos será necessário backend/funções server-side e uma chave privada do provedor de IA guardada como variável secreta na Vercel.
- Nunca compartilhe senha do banco, Supabase Secret key ou chave privada de IA.
