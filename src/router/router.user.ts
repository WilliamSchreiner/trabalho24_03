import { Router } from "express";
import { Database } from '../database';
import { randomUUID } from 'node:crypto';

const userRoute = Router();

const database = new Database();

const table = "user";

// request = parametro que esta vindo do CLIENTE
// response = parametro que esta vindo do CLIENTE
userRoute.get('/', (request, response ) => {

  const user = database.select(table);

  response.json(user)
});

userRoute.get('/:id', (request, response) => {
  const {id} = request.params

 const result = database.select(table, id);

 if(result === undefined) response.status(400).json({msg:'Usuarios nao encontrado'})

  response.json(result)
})

//metodo de add user
userRoute.post('/', (request, response ) => {
const {name,End, CPF, CEP,  saldo, transacao} = request.body;

const user = {
  id: randomUUID(),
  name,
  End,
  CPF,
  CEP,
  saldo,
  transacao
  // ou name: name, email: email
  //isso só em versões antigas
  };

  database.insert(table, user);

response.status(201).send({msg:'conta cadastrada com sucesso.'});
});

//metodo de deletar pelo ID
userRoute.delete('/:id', (request, response) => {
  const {id} = request.params

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuario nao encontrado'});

    database.delete(table, id)

    response.status(202).json(
      {msg: `Usuario ${userExist.name} deletado` });

  //database.select(table, id)
});

//metodo de editar o user
userRoute.put('/:id', (request,response)=>{
  const {id} = request.params
  const {name, End, CPF, CEP, saldo, transacao} = request.body
  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuario nao encontrado'});

    //user encontrado


    database.update(table, id, {id, name, End, CPF, CEP,  saldo, transacao})

    response.status(202).json(
      {msg: `Usuario ${userExist.name} deletado` });
})

//metodo de retirada pelo ID
userRoute.put('/retirada/:id', (request,response)=>{

  const {id} = request.params
  const {transacao: [{ tipo, valor}]} = request.body

  const userExist:any = database.select(table, id);


  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuario nao encontrado'});

    // user encontrado

    const name = userExist.name;

    let transacao = userExist.transacao
    transacao.push({tipo, valor})
    let saldo = userExist.saldo
    database.update(table, id, {id, name, saldo: saldo - valor, transacao})

    response.status(201).json(
      {msg: ` Foi retidado o valor de  ${valor} na conta ${name}` });

})

//metodo de deposito pelo ID
userRoute.put('/deposito/:id', (request,response)=>{

  const {id} = request.params
  const {transacao: [{ tipo, valor}]} = request.body

  const userExist:any = database.select(table, id);


  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuario nao encontrado'});

    // user encontrado

    const name = userExist.name;
    let transacao = userExist.transacao
    transacao.push({tipo, valor})
    let saldo = userExist.saldo
    database.update(table, id, {id, name, saldo: saldo + valor, transacao})

    response.status(201).json(
      {msg: ` Foi depositado o valor de  ${valor} na conta ${name}` });

})

userRoute.get('/', (request, response)=>{

  response.send(`Rota userRote ON.`)
})

export {userRoute}
