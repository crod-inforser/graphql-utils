export type IFields = {
    kind: string;
    description?: any;
    name: any;
    arguments: any[];
    type: any;
    directives: any[];
  };
  
  export type IDefinition = {
    kind: string;
    description?: any;
    name: { kind: string; value: string };
    interfaces: any[];
    directives: any[];
    fields: IFields[];
  };
  
  export type ISource = {
    body: string;
    name: string;
    locationOffset: { line: number; column: number };
  };
  
  export type ILoc = {
    start?: number;
    end?: number;
    source?: ISource;
  };
  
  export type IGql = {
    kind?: string;
    definitions: IDefinition[];
    loc: ILoc;
  };
  export type IResolver = {
    Query?: any;
    Mutation?:any;
  };