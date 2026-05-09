# EntregaFacil.Api

EntregaFacil.Api e uma Web API em ASP.NET Core criada para estudar C#/.NET, Entity Framework Core, SQLite, arquitetura em camadas simples e regras de negocio de um sistema de controle de entregas para loja virtual.

O projeto nao possui frontend nem autenticacao nesta primeira versao. O foco e backend, endpoints REST, Swagger, banco de dados e regras de negocio.

## Arquitetura

O projeto usa uma organizacao simples em camadas:

- `Controllers`: recebem as requisicoes HTTP e retornam respostas da API.
- `Services`: concentram as regras de negocio.
- `Repositories`: encapsulam o acesso ao banco com Entity Framework Core.
- `Models`: entidades persistidas no banco de dados.
- `DTOs`: objetos usados como entrada e saida dos endpoints.
- `Data`: configuracao do `DbContext`, relacionamentos e seeds.
- `Enums`: valores fixos como status do pedido e tipos de ocorrencia.
- `Migrations`: historico de alteracoes do banco gerado pelo EF Core.

## Tecnologias

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- Swagger/OpenAPI via Swashbuckle

## Pacotes

Pacotes adicionados ao projeto:

- `Microsoft.AspNetCore.OpenApi`
- `Microsoft.EntityFrameworkCore.Sqlite`
- `Microsoft.EntityFrameworkCore.Design`
- `Swashbuckle.AspNetCore`

A ferramenta local `dotnet-ef` tambem foi instalada para gerar e aplicar migrations.

## Como restaurar dependencias

Dentro da pasta do projeto:

```powershell
cd EntregaFacil.Api
dotnet restore
dotnet tool restore
```

## Como aplicar migrations no SQLite

```powershell
dotnet tool run dotnet-ef database update
```

Esse comando cria o arquivo local `entregafacil.db`.

## Como rodar o projeto

```powershell
dotnet run
```

Depois acesse o Swagger no navegador. A porta pode variar conforme o `launchSettings.json`, mas normalmente sera algo parecido com:

```text
http://localhost:5191/swagger
```

## Endpoints

### Products

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`

### Orders

- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders`
- `POST /api/orders/{id}/start-separation`
- `POST /api/orders/{id}/confirm-separation`
- `POST /api/orders/{id}/cancel-by-customer`
- `POST /api/orders/{id}/cancel-by-stock`

### Carriers

- `GET /api/carriers`
- `GET /api/carriers/{id}`
- `POST /api/carriers`

### Shipments

- `POST /api/orders/{id}/ship`
- `POST /api/orders/{id}/confirm-delivery`

### Delivery Occurrences

- `POST /api/orders/{id}/occurrences`
- `GET /api/orders/{id}/occurrences`

### Delivery Reviews

- `POST /api/orders/{id}/review`
- `GET /api/orders/{id}/review`

## Fluxo sugerido para testar no Swagger

1. Use `GET /api/products` para ver produtos com estoque.
2. Use `GET /api/orders` para ver pedidos iniciais.
3. Use `POST /api/orders/1/start-separation`.
4. Use `POST /api/orders/1/confirm-separation`.
5. Use `POST /api/orders/1/ship` com um corpo como:

```json
{
  "carrierId": 1,
  "trackingCode": "BR123456789",
  "shippingDate": "2026-05-06T10:00:00Z"
}
```

6. Use `POST /api/orders/1/confirm-delivery`.
7. Use `POST /api/orders/1/review` com um corpo como:

```json
{
  "rating": 5,
  "comment": "Entrega rapida e bem acompanhada."
}
```

## Regras de negocio implementadas

- Um pedido so entra em separacao se estiver `AwaitingSeparation`.
- Apenas pedidos em separacao podem ter a separacao confirmada.
- A separacao so e confirmada se todos os produtos tiverem estoque suficiente.
- Ao confirmar a separacao, o estoque dos produtos e reduzido.
- Um pedido so pode ser enviado se estiver `ReadyForShipping`.
- Para registrar envio, transportadora, codigo de rastreamento e data de envio sao obrigatorios.
- Ao registrar envio, o pedido passa para `Shipped`.
- O cliente e notificado por uma simulacao no `NotificationService`.
- A transportadora pode confirmar entrega ou registrar ocorrencia.
- Ao confirmar entrega, o pedido passa para `Delivered`.
- Ocorrencias nao encerram o pedido; ele permanece `Shipped`.
- O cliente so cancela enquanto o pedido esta `AwaitingSeparation`.
- O funcionario so cancela por falta de estoque enquanto o pedido esta `InSeparation`.
- Pedido entregue nao pode ser cancelado.
- Avaliacao so pode ser registrada quando o pedido esta `Delivered`.
- Nota da avaliacao deve estar entre 1 e 5.

## Regras simplificadas

- Nao ha autenticacao. Os papeis de cliente, funcionario e transportadora foram representados por endpoints especificos.
- A notificacao ao cliente e apenas simulada via log da aplicacao.
- O rastreamento da transportadora foi simplificado para ocorrencias e confirmacao de entrega.
- Cada pedido pode ter apenas uma entrega (`Shipment`) e uma avaliacao (`DeliveryReview`).

## Regras descartadas nesta versao

- Estorno de pagamento.
- Envio real de email.
- Integracao real com transportadoras.
- Controle de usuario, login, permissoes e perfis.
- Frontend.

## Proximas evolucoes recomendadas

- Criar autenticacao com JWT.
- Separar perfis de usuario: cliente, funcionario e transportadora.
- Adicionar testes automatizados para Services.
- Criar filtros de pedidos por status.
- Adicionar historico de mudancas de status.
- Implementar envio real de email.
- Criar paginacao em listagens.
- Criar uma camada de tratamento global de erros.
