const Contato = require('../models/ContatoModel');

module.exports.index = (req, res, next) => { 
    res.render('contato');
}

module.exports.register = (req, res, next) => { 
    const contato = new Contato(req.body);
    contato.register();
}