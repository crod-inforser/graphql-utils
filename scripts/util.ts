import { existsSync } from "https://deno.land/std/fs/exists.ts";
import { walk } from "https://deno.land/std/fs/walk.ts";
import { readFileStr } from "https://deno.land/std/fs/read_file_str.ts";
import { default as gql } from "https://cdn.pika.dev/graphql-tag@%5E2.10.3";

import { IDefinition, IResolver, IGql } from "../types/index.ts";

async function getFileNames(dir: string, exts: string[]): Promise<string[]> {
  if (existsSync(dir)) {
    const files = [];
    for await (const entry of walk(dir)) {
      if (
        entry.isFile &&
        entry.name !== "." &&
        (exts.map((ext) => entry.name.includes(ext)).includes(true))
      ) {
        if (dir === "./") {
          if (entry.name === entry.path) files.push(entry.name);
        } else {
          if (
            entry.path.slice(dir.length - 1, entry.path.length) === entry.name
          ) {
            files.push(entry.name);
          }
        }
      }
    }
    return files;
  }
  return [];
}

function getDefinitions(
  actual: IDefinition[],
  toAdd: IDefinition[],
): IDefinition[] {
  const toReturn: IDefinition[] = [];
  for (let index in toAdd) {
    const name = JSON.stringify(toAdd[index].name);
    const exist = actual.filter((obj) => JSON.stringify(obj.name) === name);
    if (!exist.length) {
      toReturn.push(toAdd[index]);
    } else {
      toReturn.push({
        ...toAdd[index],
        fields: toAdd[index].fields.concat(exist[0].fields),
      });
    }
  }
  for (let index in actual) {
    const name = JSON.stringify(actual[index].name);
    const exist = toAdd.filter((obj) => JSON.stringify(obj.name) === name);
    if (!exist.length) {
      toReturn.push(actual[index]);
    }
  }
  return toReturn;
}

export async function importResolvers(dir: string): Promise<IResolver> {
  const nameFiles = await getFileNames(dir, [".ts"]);
  let toReturn: IResolver = {};
  for (const name of nameFiles) {
    const newFunctions: { default: IResolver } = await import(`${dir}/${name}`);
    toReturn = {
      Query: {
        ...toReturn.Query,
        ...newFunctions.default.Query,
      },
      Mutation: {
        ...toReturn.Mutation,
        ...newFunctions.default.Mutation,
      },
    };
  }
  return toReturn;
}

export async function importTypedefs(dir: string): Promise<IGql> {
  const nameFiles = await getFileNames(dir, [".graphql", ".gql"]);
  let toReturn: IGql = { definitions: [], loc: {} };
  let gqlFiles: string = "";
  for (const index in nameFiles) {
    const file: string = await readFileStr(
      dir === "./" ? `./${nameFiles[index]}` : `${dir}/${nameFiles[index]}`,
      { encoding: "utf8" },
    );
    const mygql: IGql = (gql as any)`${file}`;
    gqlFiles += file;
    if (parseInt(index) === 0) {
      toReturn = mygql;
    } else {
      toReturn = {
        ...toReturn,
        definitions: getDefinitions(toReturn.definitions, mygql.definitions),
        loc: {
          ...toReturn.loc,
          end: gqlFiles.length,
          source: {
            body: gqlFiles,
            name: "GraphQL request",
            locationOffset: { line: 1, column: 1 },
          },
        },
      };
    }
  }
  return toReturn;
}
