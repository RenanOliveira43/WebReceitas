const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

let recipes = [];
const superSenha = 'vandaobobao';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const verificarSenha = (senha) => senha === superSenha;

app.get('/', (req, res) => {
    res.render('index', { recipes });
});

app.get('/add', (req, res) => {
    res.render('add_recipe');
});

app.post('/add', (req, res) => {
    const { title, description, password } = req.body;
    if (verificarSenha(password)) {
        recipes.push({ id: recipes.length + 1, title, description: description.replace(/\n/g, '<br>') });
        res.redirect('/');
    } else {
        res.status(403).send('Senha incorreta');
    }
});

app.get('/edit/:id', (req, res) => {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    res.render('edit_recipe', { recipe });
});

app.post('/edit/:id', (req, res) => {
    const { title, description, password } = req.body;
    if (verificarSenha(password)) {
        const recipe = recipes.find(r => r.id === parseInt(req.params.id));
        if (recipe) {
            recipe.title = title;
            recipe.description = description.replace(/\n/g, '<br>');
            res.redirect('/');
        } else {
            res.status(404).send('Receita não encontrada');
        }
    } else {
        res.status(403).send('Senha incorreta');
    }
});

app.get('/delete/:id', (req, res) => {
    const password = req.query.password;
    if (verificarSenha(password)) {
        recipes = recipes.filter(r => r.id !== parseInt(req.params.id));
        res.redirect('/');
    } else {
        res.status(403).send('Senha incorreta');
    }
});

module.exports = app;
