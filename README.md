# Graphql-utils

_Two tools to get .gql files and functions of resolvers of graphql deno_

## Starting 🚀

### How to install 📋

_First install "https://raw.githubusercontent.com/crod-inforser/graphql-utils/1.1/mod.ts" with deno install_

```bash
deno install https://raw.githubusercontent.com/crod-inforser/graphql-utils/1.1/mod.ts
```

## Using tools ⚙️

_First tool is importTypedefs. This tool can get all .gql or .graphql on one folder and mixed into one gql file, ready to use_
_Second tool is importResolvers. This tool can get all .ts files of one folder and mixed into one object of resolvers_

### Using importTypedefs, importResolvers and oak  🔩

```typescript
import { Application } from "https://deno.land/x/oak/mod.ts";
import { applyGraphQL } from "https://deno.land/x/oak_graphql/mod.ts";
import { importTypedefs, importResolvers } from "https://raw.githubusercontent.com/crod-inforser/graphql-utils/1.1/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

//get .gql files on folder "typedefs"
const typeDefs = await importTypedefs(join(Deno.cwd(), "typedefs"));
//get .ts files on folder "resolvers"
const resolvers = await importResolvers(join(Deno.cwd(), "resolvers"));

const app = new Application()

const GraphQLService = await applyGraphQL({
  typeDefs,
  resolvers
});

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

await app.listen({ port: 8080 });

```

### Example of .gql ⌨️

```graphql
type User {
  id: ObjectId
  name: string
}

type Query {
  getUserName(id: ObjectId): User
}

type Mutation{
  SetUserName(id: ObjectId, name:string): User
}
```

### Example of .ts file of resolver ⌨️

```typescript
export default {
  Query: {
    getUserName: (_: any, {id}: {id:string}, __: any, ___: any) => {
      return { id, name: "wooseok" };
    },
  },
  Mutation: {
    SetUserName: (_: any, {id, name}: {id:string, name: string}, __: any, ___: any) => {
      return { name, id };
    },
  },
};
```

## Building with: 🛠️

* [fs](https://deno.land/std/fs/mod.ts) - Deno official fs module
* [gql tag](https://cdn.pika.dev/graphql-tag) - Gql tag for graphql
* [path](https://deno.land/std/path/mod.ts) - Deno official path module

## Authors ✒️

* **Christian Rodriguez** - *Inforser* - [crod](crodriguez@inforser.cl)


## Licence 📄

MIT

## Thanks 🎁

* Thanks for read this readme! 📢

---
⌨️ with ❤️ for [crod-inforser](crodriguez@inforser.cl) 😊
