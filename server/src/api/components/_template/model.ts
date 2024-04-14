// inport references to data types
type MyImportMap = Record<string, MyImport>;
type MyImport = {
    id: string;
    updatedAt: string;
};

export type ItemMap = MyImportMap;
export type Item = MyImport;
