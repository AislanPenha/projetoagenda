const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: {type:String, required: true},
    sobrenome: {type:String, required: false, default: ''},
    email: {type:String, required: false, default: ''},
    contato: {type:String, required: false, default: ''},
    criandoEm: {type:Date, required: false, default: Date.now()},
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body) {
        this.body = body;
        this.user = null;
        this.errors = [];
    }
    
    register(){
        this.valida();
        if(this.errors.length > 0 ){
            return;
        } else{
          

            //this.user = await LoginModel.create(this.body);
            return;
        }
    }
    
    valida(){
        this.cleanUp();
        if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email inválido');
        if(!this.body.email && !this.body.contato) this.errors.push('Contato ou Email é requerido');
        console.log(this.errors);
    }
    cleanUp(){
        for(let key in this.body){
            if(typeof this.body[key] !== 'string') this.body[key] = '';
        }
        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            contato: this.body.contato,
        }
    }
}

module.exports = Contato;