
# 🚀 Social Media Auto Poster - GitHub Pages

Sistema completo de automação para publicação em redes sociais usando GitHub Pages e GitHub Actions.

## ✨ Características

- **Interface Web Responsiva**: Interface moderna hospedada no GitHub Pages
- **Múltiplas Plataformas**: Instagram, TikTok, YouTube, Twitter/X, Facebook
- **Agendamento Preciso**: Posts publicados no horário exato via GitHub Actions
- **Autenticação Real**: Integração com APIs oficiais de cada plataforma
- **Upload de Mídia**: Suporte para imagens e vídeos
- **Automação Completa**: Funciona 24/7 sem necessidade de servidor

## 🔧 Configuração

### 1. Fork do Repositório

1. Clique em "Fork" neste repositório
2. Clone para sua conta GitHub
3. Ative GitHub Pages nas configurações do repositório

### 2. Configuração das APIs

#### Instagram (Meta Business)
1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Crie um app e configure Instagram Basic Display API
3. Obtenha o Access Token e Business Account ID

#### TikTok
1. Acesse [TikTok Developers](https://developers.tiktok.com/)
2. Registre sua aplicação
3. Obtenha Client Key e Access Token

#### YouTube
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Ative YouTube Data API v3
3. Configure OAuth 2.0 e obtenha credenciais

#### Twitter/X
1. Acesse [Twitter Developer Portal](https://developer.twitter.com/)
2. Crie um app com permissões de escrita
3. Obtenha Client ID e Client Secret

#### Facebook
1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Configure Facebook Pages API
3. Obtenha Access Token e Page ID

### 3. Configuração dos Secrets

No GitHub, vá em Settings > Secrets and variables > Actions e adicione:

```
INSTAGRAM_ACCESS_TOKEN=seu_token_instagram
INSTAGRAM_BUSINESS_ACCOUNT_ID=seu_account_id

TIKTOK_ACCESS_TOKEN=seu_token_tiktok
TIKTOK_CLIENT_KEY=sua_client_key

YOUTUBE_CLIENT_ID=seu_client_id_youtube
YOUTUBE_CLIENT_SECRET=seu_client_secret_youtube

TWITTER_CLIENT_ID=seu_client_id_twitter
TWITTER_CLIENT_SECRET=seu_client_secret_twitter

FACEBOOK_ACCESS_TOKEN=seu_token_facebook
FACEBOOK_PAGE_ID=seu_page_id
```

### 4. Ativação do GitHub Actions

1. Vá em Actions no seu repositório
2. Ative workflows se necessário
3. O workflow será executado automaticamente a cada 5 minutos

## 📱 Como Usar

1. **Acesse o Site**: Vá para `https://seunome.github.io/nome-do-repositorio`
2. **Configure APIs**: Insira suas credenciais nas seções de autenticação
3. **Teste Conexões**: Use os botões "Testar" para validar credenciais
4. **Configure GitHub**: Adicione seu repositório e token
5. **Crie Posts**: Faça upload de mídia e configure seu conteúdo
6. **Agende ou Publique**: Escolha publicar agora ou agendar para depois

## 🔄 Como Funciona

1. **Interface Web**: Você configura posts através da interface
2. **Armazenamento**: Dados são salvos em `scheduled_posts.json`
3. **GitHub Actions**: Workflow roda a cada 5 minutos
4. **Verificação**: Script Python verifica posts agendados
5. **Publicação**: Posts são publicados nas plataformas no horário correto
6. **Atualização**: Status dos posts é atualizado automaticamente

## 📊 Formatos Suportados

### Instagram
- Feed Posts (imagens)
- Reels (vídeos)
- Stories (imagens/vídeos)

### TikTok
- Vídeos normais
- Séries

### YouTube
- Shorts (vídeos curtos)
- Vídeos normais
- Posts da comunidade

### Twitter/X
- Tweets únicos
- Threads (múltiplos tweets)

### Facebook
- Posts do feed
- Reels
- Stories

## 🛠️ Estrutura do Projeto

```
├── index.html              # Interface principal
├── script.js               # Lógica JavaScript
├── style.css               # Estilos CSS
├── scheduled_posts.json    # Posts agendados
├── .github/
│   ├── workflows/
│   │   └── social-media.yml # Workflow GitHub Actions
│   └── scripts/
│       └── social_poster.py # Script de publicação
├── media/                  # Arquivos de mídia
└── README.md              # Documentação
```

## 🔐 Segurança

- Todas as credenciais são armazenadas como GitHub Secrets
- Comunicação via HTTPS
- Tokens com permissões mínimas necessárias
- Validação de entrada em todos os formulários

## 📈 Monitoramento

- Logs detalhados nas execuções do GitHub Actions
- Status de cada post na interface
- Histórico de publicações
- Alertas em caso de falhas

## 🆘 Troubleshooting

### Posts não são publicados
1. Verifique se os secrets estão configurados corretamente
2. Confirme se o GitHub Actions está ativo
3. Verifique logs da última execução

### Erro de autenticação
1. Renove tokens expirados
2. Verifique permissões das APIs
3. Confirme se as credenciais estão corretas

### Interface não carrega
1. Verifique se GitHub Pages está ativo
2. Confirme o endereço do site
3. Limpe cache do navegador

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Avisos Importantes

- Respeite os termos de uso de cada plataforma
- Não faça spam ou publique conteúdo inadequado
- Monitore seus tokens e renove quando necessário
- Mantenha suas credenciais seguras

## 📞 Suporte

Para suporte, abra uma [issue](https://github.com/seu-usuario/seu-repo/issues) no repositório.

---

**Feito com ❤️ para automatizar suas redes sociais!**
