#  MovieFlix API

API simples para gerenciar filmes (MovieFlix). Fornece endpoints REST para listar, filtrar, criar, atualizar e deletar filmes — com documentação via Swagger e persistência em PostgreSQL através do Prisma.

---

##  Sobre o projeto

MovieFlix API é um projeto de backend desenvolvido para expor endpoints de gerenciamento de filmes. É ideal para estudos, exercícios de backend e como base para projetos fullstack.

**Principais pontos:**
- Endpoints para CRUD completo de filmes.
- Filtros por idioma e gênero, além de ordenação por título ou data de lançamento.
- Documentação interativa e automática com **Swagger**.
- Preparado para rodar localmente ou isolado em contêineres via Docker.

---

## Funcionalidades

- `GET /movies` — lista filmes (retorna também `totalMovies` e `averageDuration`).
- `GET /movies/filter?language=<>&sort=<title|release_date>` — filtrar por idioma e ordenar.
- `GET /movies/language?language=<nome>` — lista filmes por idioma.
- `GET /movies/:genreName` — filtrar por nome de gênero.
- `POST /movies` — criar filme.
- `PUT /movies/:id` — atualizar filme.
- `DELETE /movies/:id` — remover filme.
- `GET /docs` — UI do Swagger com a especificação disponível.

> *Nota: A documentação Swagger (`/docs`) descreve os schemas `Movie` e `MovieInput`, detalhando o formato esperado das requisições e respostas.*

---

## Tecnologias

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

---

##  Pré-requisitos

- Node.js 20+
- npm
- PostgreSQL (local ou via Docker)
- Variável de ambiente `DATABASE_URL` apontando para o Postgres

---

##  Como rodar (desenvolvimento)

### 1. Clone o repositório  
```bash
git clone https://github.com/Arthurthedev/movieflix-api.git
cd movieflix-api
```
### 2. Instale dependências
```bash
npm install
```
### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# edite .env para apontar DATABASE_URL
```
### 4. Rode as migrations e gere o client do Prisma
```bash
npx prisma generate
npx prisma migrate dev
```
### 5. Inicie o servidor em modo dev
```bash
npm run dev
```
### 6. Acesse
- API: http://localhost:3000
- Swagger UI: http://localhost:3000/docs

---
##  Licença

Este projeto está sob a licença MIT.

##  Autor

**Arthur**
* LinkedIn: [LinkedIn](https://www.linkedin.com/in/arthur-moraes-dev/)
* GitHub: [@Arthurthedev](https://github.com/Arthurthedev)
