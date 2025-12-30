# Deploy (Contabo) — opção 1 (1 comando)

## Pré-requisitos no servidor

- Docker + Docker Compose (plugin `docker compose` ou `docker-compose`)
- Git
- Portas liberadas (padrão do projeto):
  - Frontend: `3105/tcp`
  - Backend: `3101/tcp`

## 1) Clonar o repositório

Recomendação: usar `/srv/currency`.

```bash
mkdir -p /srv
cd /srv
git clone git@github.com:alextavares/currency.git
cd currency
```

Se o `git clone` pedir senha/usuário, configure uma chave SSH no servidor e cadastre no GitHub:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_github -N "" -C "contabo-currency"
cat ~/.ssh/id_ed25519_github.pub
```

Depois adicione a chave no GitHub:
- Settings → SSH and GPG keys **(na conta)**, ou
- Repo → Settings → Deploy keys **(por repositório)**

E no servidor, crie/ajuste `~/.ssh/config`:

```sshconfig
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
```

## 2) Configurar `.env` do compose (frontend)

```bash
cp .env.example .env
```

Edite `NEXT_PUBLIC_SOCKET_URL` para o seu domínio/IP (idealmente com HTTPS quando tiver).

## 3) Subir tudo (build + up)

```bash
chmod +x deploy.sh
./deploy.sh
```

## 4) Atualizar em 1 comando

Sempre que você der push no GitHub:

```bash
ssh innerai 'cd /srv/currency && ./deploy.sh'
```
