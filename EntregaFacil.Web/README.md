# EntregaFacil.Web

Frontend em Next.js para consumir a API local do EntregaFacil.

## Rodar localmente

```powershell
npm install
copy .env.example .env.local
npm run dev
```

Configure `NEXT_PUBLIC_API_URL` em `.env.local` se a API estiver em outra porta.

```env
NEXT_PUBLIC_API_URL=http://localhost:5191
```

Abra:

```text
http://localhost:3000
```
