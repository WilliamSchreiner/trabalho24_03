import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)


export class Database {
  #database:any = [];


  constructor(){
    fs.readFile(databasePath, 'utf8')
    .then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      fs.writeFile(databasePath, JSON.stringify({}, null, 2))
    })

  }

  //catch = quando a promesa nao é comprida ele trata com outro callback
  //parse = converte o objeto escrito para objeto
  //Stringing = converte o objeto  para objeto escrito

  #persist(){

    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
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


  delete(table:any, id:string): void{


    //procura de id
    const rowIndex  = this.#database[table].findIndex((row:any) => row.id === id)

    //validando o id e delete
    if(rowIndex > -1){
      this.#database[table].slice(rowIndex, 1);
      this.#persist();

    }
  }


  update(table:any, id:string, data:object): void{

    const rowIndex = this.#database[table].findIndex((row:any)=> row.id === id);

    if(rowIndex > -1) {
      this.#database[table][rowIndex] = data
      // ... = desconstruir um objeto
      this.#persist()
    }

  }
}
