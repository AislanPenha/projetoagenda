const Login = require('../models/LoginModel');

module.exports.index = (req, res, next) => { 
    if(req.session.user){
        return res.render('login-logado');
    }else{
        return res.render('login');
    }
}

module.exports.register = async (req, res) => {
    const login = new Login(req.body);
    try {
        await login.register();
        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(()=> {
                res.redirect('back');
            });
        }else {
            req.flash('success', 'Usuário cadastrado com sucesso.');
            req.session.save(()=> {
                res.redirect('back');
            });
        }
    }catch(e){
        console.log(e);
    }
}
module.exports.login = async (req, res) => {
    const login = new Login(req.body);
    try {
        await login.login();
        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(()=> {
                res.redirect('back');
            });
        }else {
            req.flash('success', 'Usuário logado com sucesso.');
            req.session.user = login.user;
            req.session.save(()=> {
                return res.redirect('back');
            });
        }
    }catch(e){
        console.log(e);
    }
}
module.exports.logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/');

}
