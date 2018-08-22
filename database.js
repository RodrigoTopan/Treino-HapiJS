const { readFile, writeFile } = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const { join } = require('path');
class Database{
    constructor(){
        this.FILENAME = 'heroes.json';
    }
        
        //Obtém dados do nosso arquivo
        async getHeroes(){
            const data = await readFileAsync(this.FILENAME);
            return JSON.parse(data);
        }   
        async getHeroesByID(id){
            const data = await this.getHeroes();
            const found = data.find(id);
            return JSON.parse(found);
        }    
        
        async createHero(item){
            const data = await this.getHeroes();
            data.push(item);
            return this.updateFile(data);
        }
        
        async updateFile(data){
            return writeFileAsync(this.FILENAME, JSON.stringify(data))
        }

        async deleteHero(id){
            const data = await this.getHeroes(id);
            //Iteramos em cima da lista, procurando todo mundo que não tenha aquele ID
            // != compara somente o valor
            // !== compara o valor e o tipo
            const dataFiltrados = data.filter(item => item.id !== id);
            return this.updateFile(dataFiltrados);
        }
        
    }
    
    module.exports = new Database();