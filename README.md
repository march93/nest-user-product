<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) project using GraphQL and SQlite.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Relationships
```
user {
  id: string (uuid)
  email: string
  name: string
  age: int
  products: Product[]
}

product {
  id: string (uuid)
  name: string
  price: float
}

users_products {
  user_id: string
  product_id: string
}

Users <> Products (many to many relationship)
```

## Testing endpoints
[GraphQL Playground](http://localhost:3000/graphql) will be available at once you start the server.

### Users

Queries for users

```
query user {
  user(id: "user_id") {
    id
    email
    name
    age
    products {
      id
      name
      price
    }
  }
}
```

```
query users {
  users {
    id
    email
    name
    age
    products {
      id
      name
      price
    }
  }
}
```

Mutations for users <br />
**When adding products, ids or names (case sensitive) can be used**

```
mutation createUser {
  createUser(
    createUserInput: { 
      email: "email"
      name: "name"
      age: 100
      products: ["list of product ids or names"]
    }
  ) {
    id
    email
    name
    age
    products {
      id
      name
      price
    }
  }
}
```

```
mutation updateUser {
  updateUser(
    updateUserInput: {
      id: "user_id"
      email: "email"
      name: "name"
      products: ["list of product ids or names"]
    }
  ) {
    id
    email
    name
    age
    products {
      id
      name
      price
    }
  }
}
```

```
mutation removeUser {
  removeUser(id: "user_id")
}
```

### Products

Queries for products

```
query products {
  products {
    id
    name
    price
  }
}
```

```
query product {
  product(id: "product_id") {
    id
    name
    price
  }
}
```

Mutations for products

```
mutation createProduct {
  createProduct(
    createProductInput: {
      name: "name"
      price: 9.99
    }
  ) {
    id
    name
    price
  }
}
```

```
mutation updateProduct {
  updateProduct(
    updateProductInput: {
      id: "product_id"
      name: "name",
      price: 10.99
    }
  ) {
    id
    name
    price
  }
}
```

```
mutation removeProduct {
  removeProduct(id: "product_id")
}
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
