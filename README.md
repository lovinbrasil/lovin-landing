# Lovin Landing

Landing page e painel administrativo do Lovin Brasil, construídos com Next.js, Supabase Auth e Supabase Database.

## Desenvolvimento

```bash
npm install
npm run dev
```

O servidor de desenvolvimento abre em `http://localhost:3000` quando a porta estiver disponível.

## Variáveis de ambiente

Crie ou mantenha um `.env.local` com:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` é recomendada para o painel admin porque algumas telas precisam consultar dados de moderação, usuários e recursos globais.

## Rotas

- `/` - landing page pública do Lovin Brasil
- `/admin/login` - login administrativo
- `/admin` - dashboard protegido
- `/admin/users` - usuários e flags operacionais
- `/admin/approvals` - aprovações de verificação de identidade
- `/admin/communities` - CRUD de comunidades
- `/admin/events` - CRUD de eventos
- `/admin/reports` - moderação de denúncias
- `/admin/engagement` - engajamento, matches, conversas e mensagens
- `/admin/data/[resource]` - CRUD JSON para recursos permitidos

## Acesso admin

O acesso ao painel usa Supabase Auth e o arquivo `proxy.ts` para proteger as rotas `/admin`. Um usuário pode acessar o painel quando `auth.users.raw_app_meta_data.role` for `admin` ou `moderator`.

## Validação

```bash
npm run lint
npm run build
```
