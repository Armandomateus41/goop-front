### Tecnologias utilizadas
Frontend
React + Vite

TypeScript

Tailwind CSS

ShadCN UI

React Hook Form

Zod

Axios

React Router DOM

#### Funcionalidades principais

Autenticação de administradores com JWT

Cadastro, listagem, edição e exclusão de administradores

Cadastro e gestão de pedidos

Filtros, paginação e visualização de pedidos

Layout responsivo com Sidebar colapsável

Dashboard com cards de resumo

Toasts de feedback visual

Exportação de pedido como PDF
```

POST /api/pedidos
GET /api/pedidos?page=1&status=PENDENTE&cliente=joao
GET /api/pedidos/:id
PUT /api/pedidos/:id
PATCH /api/pedidos/:id
DELETE /api/pedidos/:id


### Instale a versão 3.x do Tailwind CSS

npm install tailwindcss@3.4.1 --save-dev --force
npx tailwindcss init -p

 Removemos a versão 4.x do Tailwind, que estava causando problemas
 Instalamos a versão estável 3.4.1

 ### Roda o backend

 npm run start:watch
