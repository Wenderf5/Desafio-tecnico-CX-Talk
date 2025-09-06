# Desafio técnico - CX + Talk

## Descrição

A aplicação funciona de forma simples, ao entrar na aplicação você é redirecionado para uma página de autenticação onde pode criar uma conta ou se logar em uma já existente, para criar uma conta pode usar um E-mail fictício como exemplo@gmail.com, ao entrar com seu usuário ou criar uma conta você chega a parte de perfil onde pode alterar seu nome de usuário ou entrar no chat, o chat é simples, mas funcional, várias pessoas podem conversar em simultâneo, e você pode ver quem está online ou offline clicando no icone de user no canto superiro direito, ou sair da sala clicando no icone de sair no canto superior esquerdo. Para simular uma conversa no chat eu recomendo criar duas contas e entrar em uma pela aba de navegação anônima, assim você pode simular uma conversa entre duas pessoas e ver como chat funciona. 

## Tecnologias necessarias para rodar o projeto

1. NodeJS.
2. Docker.

## Instruções para rodar o projeto

1. Clone o repository.
2. Entre na pasta Back-end e rode o comando abaixo para intalar as dependências do back-end.
```bash
npm install
```
3. Renomei o arquivo `.env.example` na pasta back-end para `.env`.
4. Substitua o conteúdo do arquivo `.env` pelas configurações abaixo.
```env
DATABASE_URL="postgresql://root_development:root_development@localhost:5432/cx-talk-challenge-development?schema=public"
JWT_SECRET="4f8b9c2e-7d15-4a91-9f2c-1e6b3d5a8f7c:Zx7vB!p2@qW9eR#tY6uI8oP0sD4fG1hJ"
```
5. Ainda na pasta Back-end e rode o comando abaixo para iniciar o back-end da aplicação.
  ```bash
  npm run start
  ```
6. Entre na pasta Front-end rode o comando abaixo para instalar as dependências do front-end.
```bash
npm install
```
7. Ainda na pasta Front-end rode o comando abaixo para iniciar o front-end.
```bash
npm run dev
```
8. Entre no navegador e pesquise por "http://localhost:5173"

## OBS

Para simular uma conversa no chat eu recomendo criar duas contas e entrar em uma pela aba de navegação anônima, assim você pode simular uma conversa entre duas pessoas e ver como chat funciona. 

## Como rodar os testes

1. Clone o repository.
2. Entre na pasta Back-end e rode o comando abaixo para intalar as dependências do back-end.
```bash
npm install
```
3. Renomei o arquivo `.env.example` na pasta back-end para `.env`.
4. Substitua o conteúdo do arquivo `.env` pelas configurações abaixo.
```env
DATABASE_URL="postgresql://root_test:root_test@localhost:5433/cx-talk-challenge-test?schema=public"
JWT_SECRET="4f8b9c2e-7d15-4a91-9f2c-1e6b3d5a8f7c:Zx7vB!p2@qW9eR#tY6uI8oP0sD4fG1hJ"
```
6. Ainda na pasta Back-end rode o comando `npm run test` para rodar os testes unitários ou `npm run test:e2e` para os testes E2E.

## OBS
Não use as configurações de desenvolvimento no arquivo `.env` para rodar os testes ou as onfigurações de teste para rodar o projeto em desenvolvimento. No arquivo `docker-compose` há dois bancos, um para teste e outro para desenvolvimento.
