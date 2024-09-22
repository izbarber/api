# Documentação da API - Izibarber

## Configuração Inicial
Para iniciar o projeto, é necessário criar um arquivo .env na raiz do projeto com a seguinte variável de ambiente:

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/izibarber?schema=public"
```

--- 

## Executando a API

### Pré-requisitos

1. pnpm: O projeto utiliza o gerenciador de pacotes pnpm. Se ainda não estiver instalado globalmente, execute:

```bash
npm i -g pnpm
```

Verifique se a instalação foi bem-sucedida rodando:

```bash
pnpm -v
```

### Passos para rodar a API

1. Instale as dependências: No diretório raiz do projeto, execute:

```bash
pnpm install
```

2. Execute o projeto: Para iniciar a API, basta rodar:

```bash
pnpm dev
```

--- 

## Executando o Banco de Dados PostgreSQL via Docker

Caso você não tenha o PostgreSQL instalado localmente, siga os passos abaixo para subir o banco usando Docker:

1. Instale o Docker Desktop:
  - Se estiver no Windows, baixe e instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Execute o Docker Desktop:
  - Após a instalação, abra e inicie o Docker Desktop.
3. Suba o container do PostgreSQL:
  - No terminal, na raiz do projeto, execute:
    ```bash
    docker-compose up
    ```
  - Para rodar os containers em segundo plano e liberar o terminal, use:
    ```bash
    docker-compose up -d
    ```
4. Verifique se o container está em execução:
  - Execute o comando:
    ```bash
    docker ps
    ```
    O container que deve aparecer na lista tem a imagem com o nome ```bitnami/postgresql:latest```.
  
5. Tudo pronto!
  - O banco de dados está em execução e pronto para uso.

---

## Documentação das Rotas

Para visualizar a documentação das rotas da API, acesse:

http://localhost:3333/docs

