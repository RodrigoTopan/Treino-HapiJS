/*
    Autor: Rodrigo
    Descrição:
    
    O nodejs é bem popular para trabalhar com APIs
    A diferença para uma aplicação JAVA contra uma aplicação javascript

    Quanto o Java recebe um requisição ele levanta um thread
    O limite de processamento, limite de usuários é relativo a quantidade de recursos da máquina

    Se eu quiser 1000000 de usuários == MAQUINA PARRUDONA

    Quando o nodejs recebe uma reuqisição ele delega ao sistema operacional que enfilera essas requisições  
*/

//Para subir um servidor do zero sem framework
/** 
*   const http = require('http');
*
*    http.createServer((req, resp) =>{
*        resp.end('Hello World');
*    })
*    //Inicializamos nosso servidor
*    .listen(3000,()=>{
*        console.log('Servidor Rodando');
*    });
*
*    Para trabalhar com aplicações profissionais, instalaremos o hapi.js na versão 16
*    npm install --save hapi@16
*/

/**
 *  O HAPI.JS trabalha seguindo a especificação restfull
 *  Dependendo da chamada, dependendo do código http ele retorna um status diferente
 *  E identifica quem será chamado de acordo com método
 * 
 *  POST - /products -> { body da requisição }
 *  READ - GET - /products -> { listar informações }
 *  READ - GET - /products/:id -> { Obter um recurso pelo id }
 *  READ - GET - /products/:id/colors -> { obtem todas as cores de um produto específico}
 *  
 * UPDATE
 * 1-forma => PUT - atualizar o objeto completo
 * PUT - /products/:id -> dados completos no body da requisição
 * 
 * 2-forma => PATCH -> atualiza o objeto parcial
 * PATCH - /products/:id -> dados parciais ( só nome, só cpf ou outro)
 * 
 * DELETE
 * - DELETE - /products/:id -> remove um produto específico 
 */
// Importamos nossa classe de banco de dados
const Database = require('./database');
const Hapi = require('hapi');
const server = new Hapi.Server();
const Joi = require('joi');
server.connection({port:3000});

/**
 * Para validar a requisição, sem precisar ficar fazendo um monte de if 
 * instalamos o Joi
 * npm i --save joi
 */

;(async() =>{
    server.route([
        //Criamos a rota de listar heróis
        {
            //Definir a url
            path: '/heroes',
            method:'GET',
            //Quando o usuário chamar o localhost:3000/heroes -> GET
            // Esta função vai manipular a sua reposta
            handler: async (request, reply) => {
                try{
                    const data = await Database.getHeroes();
                    return reply(data);
                }
                catch(error){
                    console.error('DEU RUIM ',error);
                    return reply();
                }
            }
        },
        {
            //Definir a url
            path: '/heroes/{id}',
            method:'GET',
            //Quando o usuário chamar o localhost:3000/heroes -> GET
            // Esta função vai manipular a sua reposta
            handler: async (request, reply) => {
                try{
                    const data = await Database.getHeroByID();
                    return reply(data);
                }
                catch(error){
                    console.error('DEU RUIM ',error);
                    return reply();
                }
            }
        },
        {
            path: '/heroes',
            method: 'POST',
            handler: async (request,reply) =>{
                try{
                    //Request recebe os items via post
                    const body = request.payload;
                    const item = {
                        id: Date.now(),
                        ...body
                    }
                    const data = await Database.createHero(item);
                    return reply('Cadastrado com sucesso !');
                }
                catch(error){
                    console.error('DEU RUIM', error);
                    return reply();
                }
            },
            config: {
                //Para validar a requisição
                validate: {
                    //Podemos validar todos os tipos de requisições
                    // --> payload -> body da requisição
                    // -> params -> URL da requisição ex: products/:id
                    // -> query -> URL products?nome=Rodrigo&idade=20
                    // -> headers -> geralmente usado para validar tokens
                    payload: {
                        name: Joi.string().max(10).min(2).required(),
                        power: Joi.string().max(5).min(3).required(),
                        birth_date: Joi.date().required()
                    }
                }
            }
        },
        {
            path: '/heroes/{id}',
            method: 'DELETE',
            config: {
                validate:{
                    params:{
                        id:Joi.number().required()
                    }
                }
            },
            handler: async (request, reply) =>{
                const { id } = request.params;
                const data = await Database.deleteHero(id);
                return reply('Removido com sucesso');
            }
        }
    ]);
    // Inicializamos nossa API
    // 1º startar a API
    await server.start();
    console.log('Server running at 3000')
})();