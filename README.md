## Requisistos
* Node.js 22 ou superior  - Conferir a versão: Node -v
## sequcien para criar o projeto
Criar o arquivo package
npm init -y
ou podes usar o npm init
Instalar o expressse para gerencviar as requisições , rotas e URLs , entre outras funcionalidade


npm install express
npm install express --save

Instalar os pactes para suporte ao Typescript 
npm i --save-dev @types/express
npm i --save dev @types/node

Instalar o compilador do projeto typscript  do projeto e reinica o projeto

npm i --save-dev ts-node

TypeORM é um ORM que pode ser executado em plataformas NodeJS, Browser, Cordova, PhoneGap
Instalar a dependeciua para conectar o Node.s (TypeScript)  com bano de dados.
 * npm install typeorm --save *

 ### Você precisa instalar reflect-metadatao calço para instalar meta dados 
 npm install reflect-metadata --save

 ### Instalar um driver de banco de dados
 npm install mysql2 --save

Compilar o arquivo TypeScript. Executar o arquivo gerado.
```
npm run start:watch
```

Comando SQL para criar a base de dados.
```
CREATE DATABASE medlink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Gerar o arquivo de configuração para o TypeScript.
```
npx tsc --init
```

Compilar o arquivo TypeScript.
```
npx tsc
```

Executar o arquivo gerado com Node.js.
```
node dist/index.js
npm install --save-dev nodemon


```
## Criar variável de ambiente
# instalar localmente (recomendado) 
npm install dotenv --save-dev @types/dotenv
```
### Criar tabela no banco de dados com migrations 
```
 Manipular variáveis de ambiente.
```
npm install dotenv --save
```

Instalar os tipos do TypeScript.
```
npm install --save-dev @types/dotenv
```
### Criar tabela no banco de dados com migrations
Criar a migrations que será usada para criar a tabela no banco de dados.
```
npx typeorm migration:create src/migration/<nome-da-migrations>
npx typeorm migration:create src/migration/1742566498314-CreateSituationsTable
``` 
```
npx typeorm migration:create src/migration/CreateSituationsTable
``` 

### crição e envio de API  com enviar dados para API com Thunder Client

### Instale a versão 3.x do Tailwind CSS

npm install tailwindcss@3.4.1 --save-dev --force
npx tailwindcss init -p

 Removemos a versão 4.x do Tailwind, que estava causando problemas
 Instalamos a versão estável 3.4.1

 ### Roda o backend

 npm run start:watch
