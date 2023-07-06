const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: {type:String, required: true},
    senha: {type:String, required: true},
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.user = null;
        this.errors = [];
    }
    
    async register(){
        this.valida();
        if(this.errors.length > 0 ){
            return;
        } else{
            await this.userExists();
            if(this.errors.length > 0) return;
            const salt = bcrypt.genSaltSync();
            this.body.senha = bcrypt.hashSync(this.body.senha, salt);
            this.user = await LoginModel.create(this.body);
            return;
        }
    }
    async login(){
        this.valida();
        if(this.errors.length > 0 ){
            return;
        } else{
            this.user = await LoginModel.findOne({email: this.body.email});
            if(!this.user) {
                this.errors.push('Usuário não cadastro');
                return;
            }else{
                if(!await bcrypt.compare(this.body.senha, this.user.senha)){
                    this.errors.push('Senha/Email inválido.');
                    return;
                }
            }
            if(this.errors.length > 0) return;
            const salt = bcrypt.genSaltSync();
            this.body.senha = bcrypt.hashSync(this.body.senha, salt);
            this.user = await LoginModel.create(this.body);
            return;
        }
    }
    async userExists() {
        this.user = await LoginModel.findOne({email: this.body.email});
        if(this.user) this.errors.push('Email já cadastrado.');
    }
    valida(){
        this.cleanUp();
        if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido');
        if(this.body.senha.length < 4 || this.body.senha.length > 30 ) this.errors.push('Senha entre 3 e 30 caracteres');
    }
    cleanUp(){
        for(let key in this.body){
            if(typeof this.body[key] !== 'string') this.body[key] = '';
        }
        this.body = {
            email: this.body.email,
            senha: this.body.senha
        }
    }
}

module.exports = Login;