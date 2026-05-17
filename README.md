# EntregaFacil

EntregaFacil e uma aplicacao fullstack demonstravel para portfolio tecnico. O sistema simula o controle de entregas de uma loja virtual, desde o cadastro de produtos ate separacao, envio, ocorrencias, entrega e avaliacao do cliente.

O projeto usa somente dados ficticios. Nao ha autenticacao, pagamento, envio real de e-mail ou integracao real com transportadoras nesta versao.

## Estrutura

```text
EntregaFacil.Api/   Backend ASP.NET Core Web API
EntregaFacil.Web/   Frontend Next.js
```

## Tecnologias

Backend:

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQLite local
- Swagger/OpenAPI via Swashbuckle

Frontend:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel como destino de deploy do frontend

## Como Rodar O Backend

Entre na pasta da API:

```powershell
cd EntregaFacil.Api
```

Restaure dependencias e ferramentas:

```powershell
dotnet restore
dotnet tool restore
```

Crie ou atualize o banco SQLite local:

```powershell
dotnet tool run dotnet-ef database update
```

Rode a API:

```powershell
dotnet run
```

Swagger:

```text
http://localhost:5191/swagger
```

Se o terminal mostrar outra porta, use a porta indicada pelo `dotnet run`.

## Como Rodar O Frontend

Em outro terminal, entre na pasta do frontend:

```powershell
cd EntregaFacil.Web
```

Instale as dependencias:

```powershell
npm install
```

Crie um arquivo `.env.local` com a URL da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:5191
```

O projeto tambem possui `.env.example` com esse valor.

Rode o frontend:

```powershell
npm run dev
```

Acesse:

```text
http://localhost:3000
```

Se o Next.js usar outra porta, como `3001` ou `3002`, acesse a porta exibida no terminal.

## Variavel De Ambiente

O frontend consome a API pela variavel:

```env
NEXT_PUBLIC_API_URL=http://localhost:5191
```

Para usar outra porta no backend, ajuste apenas esse valor em `EntregaFacil.Web/.env.local`.

## CORS

O backend permite chamadas do frontend local nas origens:

- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`

## Funcionalidades Do Frontend

- Landing page de portfolio com tecnologias e modulos do sistema.
- Dashboard com indicadores calculados pela API.
- Produtos: listagem, cadastro e edicao.
- Pedidos: listagem, detalhes, cadastro e fluxo operacional.
- Transportadoras: listagem, cadastro e detalhes.
- Envio de pedido com transportadora, rastreamento e data de envio.
- Registro e timeline de ocorrencias.
- Avaliacao de entrega para pedidos entregues.

## Endpoints Do Backend

Products:

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`

Orders:

- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders`
- `POST /api/orders/{id}/start-separation`
- `POST /api/orders/{id}/confirm-separation`
- `POST /api/orders/{id}/cancel-by-customer`
- `POST /api/orders/{id}/cancel-by-stock`

Carriers:

- `GET /api/carriers`
- `GET /api/carriers/{id}`
- `POST /api/carriers`

Shipments:

- `POST /api/orders/{id}/ship`
- `POST /api/orders/{id}/confirm-delivery`

Delivery Occurrences:

- `POST /api/orders/{id}/occurrences`
- `GET /api/orders/{id}/occurrences`

Delivery Reviews:

- `POST /api/orders/{id}/review`
- `GET /api/orders/{id}/review`

## Regras De Negocio Implementadas

- Um pedido so entra em separacao se estiver `AwaitingSeparation`.
- Apenas pedidos em separacao podem ter a separacao confirmada.
- A separacao so e confirmada se todos os produtos tiverem estoque suficiente.
- Ao confirmar a separacao, o estoque dos produtos e reduzido.
- Um pedido so pode ser enviado se estiver `ReadyForShipping`.
- Para registrar envio, transportadora, codigo de rastreamento e data de envio sao obrigatorios.
- Ao registrar envio, o pedido passa para `Shipped`.
- A transportadora pode confirmar entrega ou registrar ocorrencia.
- Ao confirmar entrega, o pedido passa para `Delivered`.
- Ocorrencias nao encerram o pedido; ele permanece `Shipped`.
- O cliente so cancela enquanto o pedido esta `AwaitingSeparation`.
- O funcionario so cancela por falta de estoque enquanto o pedido esta `InSeparation`.
- Pedido entregue nao pode ser cancelado.
- Avaliacao so pode ser registrada quando o pedido esta `Delivered`.
- Nota da avaliacao deve estar entre 1 e 5.

## Deploy Do Frontend Na Vercel

Nesta fase, apenas o frontend esta preparado para deploy na Vercel. O backend e o banco SQLite ainda rodam localmente.

Passos gerais:

1. Suba o repositorio para o GitHub.
2. Na Vercel, importe o repositorio.
3. Configure o projeto apontando para a pasta `EntregaFacil.Web`.
4. Configure a variavel `NEXT_PUBLIC_API_URL`.
5. Publique o frontend.

Importante: enquanto o backend estiver apenas local, o frontend publicado na Vercel nao conseguira consumir a API da sua maquina. Para uma demo online completa, sera necessario hospedar tambem o backend e trocar o SQLite local por uma solucao de banco hospedada.

## Proximas Evolucoes

- Hospedar o backend.
- Trocar SQLite local por um banco gratuito hospedado.
- Criar autenticacao com JWT.
- Separar perfis de cliente, funcionario e transportadora.
- Adicionar testes automatizados.
- Criar historico detalhado de status.
- Implementar envio real de e-mail.
- Integrar transportadoras reais.
