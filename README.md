<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## App Stacks:

1. GraphQL: [https://graphql.org/]
2. Apollo: [https://www.apollographql.com/docs/apollo-server/]
3. NestJS(GraphQL):[https://docs.nestjs.com/graphql/quick-start]
4. TypeORM: [https://typeorm.io/#/migrations]
5. PostgreSQL: [https://www.postgresql.org/]
6. TypeScript: [https://www.typescriptlang.org/]

## Description

GraphQL API app for **schoolX admin** and **schoolX Client** which is written by nodeJS + Typescript

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## HOW TO: Setup app:

### 1. Install postgreSQL

a. Install postgreSQL and create the credentials as you can see in **.ormconfig** file, include create server, db name, user name and password
b. Run migration in app:

```
npm run start:dev
npm run migrate:up
```

c. if _failed_ or have some _errors_, here are these steps you could follow:

```
"Ctrl + C" to stop server
remove dist folder
delete all files in src/migrations
npm run migrate:gen
npm run start:dev
npm run migrate:up
```

d. Open pgAdmin and make sure all tables are generated.

### 2. Install google cloud cli/SDK

a. Read and Install follow this docs: [https://cloud.google.com/sdk/docs/quickstart#windows]
b. Login it with the credential:

```
 user: superknife0513@gmail.com
 password: Inbox
```

c. **Important** Change the root folder when saving the file:

```
Go to .env.development
Change STORAGE_FOLDER value
```

You can lost your files if you don't implement these steps

---

## HOW TO: Test our app:

#### 1. graphQL

> The app is written using graphQL and typeORM so you can test it in two ways

a. Using native playground: `localhost:<PORT_NUMBER>/graphQL`

```
 query { heartBeat }
```

b. For more convenience when uploading file and testing, you can use **Altair**
Download: [https://altair.sirmuel.design/]

```
mutation AddDocs($file: FileUpload!) {
documentMutation {
  addDocumentToLesson(lessonId: 8, data: {
    file: $file
    title: "Syllabus 1"
  }) {
      id
      url
    }
  }
}
```

You can get the **403 error** with this query if you don't have properly token.

c. You can check the document for graphQL API in docs for **Altair** and **playground**

#### 2. Authentication and authorization

a. All app functionality will be guarded by authentication mechanism, you should create an ultimateUser admin with full power access control like so:

> Example: The name, email, password is totally up to you, this is just an examples

```
mutation Signup {
  adminAuthMutation {
    signUp(data: {
      name: "Toan"
      email: "phanhuutoan.dev@outlook.com"
      password: "Toan1234"
    }) {
      token
    }
}
```

**AND**

```
mutation Signin{
	adminAuthMutation {
      signIn(data: {
        email: "phanhuutoan.dev@outlook.com",
        password: "Toan1234"
      }) {
        token
        role
      }
    }
}
```

b. Take token which API sent back and add it to header:
`authorization: Bearer <token>`

---

### 3. RUN with docker: one command setup everything

- This is the most easy way
  a. You should install docker from [https://www.docker.com/]
  b. Create a **data** folder inside the root folder of our project.
  c. run command: `docker compose up`
  d. if there is any problem after run the command above please run it one more time and you're good to go.
  d. DONE :D

**WARNING: MUST READ**

- You need to go to _docker-compose.yml_ file, looking at **environment** and change it follow your demand.
- Run with docker can cost more RAM than traditional way, you should aware of it.
