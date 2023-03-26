import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)


export class Database {
  #database: any = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
  }


  select(table: any, id?: string): object {
    let data = this.#database[table] ?? []
    // ?? = um operador que verifica se o estado da condição esta NULL ou UNDER, se esta ele NULL ele alocar o espaço para um dado ja programado.

    if(id){ data = data.find((row:any) => {
      return row.id === id;
    })};

    return data
  }

  insert(table: any, data:object): object {//espera uma objeto

    if(Array.isArray(this.#database[table])) {
      // add o dado
      this.#database[table].push(data);
      this.#persist();
    } else {
      // altera um dado ja existente
      this.#database[table] = [data]
    }

    return data //retorna uma objeto
  }


  delete(table: string, id: string) {
    const rowIndex = this.#database[table].findIndex(
      (row: any) => row.id === id
    );

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }


  update(table: string, id: string, data: object) {
    const rowIndex = this.#database[table].findIndex(
      (row: any) => row.id === id
    );

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }

  }
}
