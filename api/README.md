## Descrição

Repositório feito utilizando NestJs, TypeORM e como banco, MySQL.

## Instalação

Para rodar esse projeto será necessário a utilizacão do docker.
Portanto, instalar o docker e o docker-compose

## Rodando o aplicativo

```bash
$ docker-compose up
```

## Utilização
Após o docker está totalmente pronto, a aplicacão estará rodando na porta 3000.

Certifique que nenhum outro aplicativo está rodando nesta porta.

## Rotas
### POST /cnab
Rota responsável por fazer o processamento das transacões e armazenar no banco de dados.

### GET /store
Rota responsável por retornar todos os estabelecimentos cadastrados no banco.

### GET /transaction/{storeId}
Rota responsável por retornar todas as transacões de um dado estabelecimento.

## Testes
Rodar os testes irão reiniciar o banco de dados, não estou usando outro somente para teste.

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
