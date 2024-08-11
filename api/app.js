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
    try {
        const { title, description, password } = req.body;
        if (verificarSenha(password)) {
            const newRecipe = { id: (recipes.length > 0 ? recipes[recipes.length - 1].id : 0) + 1, title, description: description.replace(/\n/g, '<br>') };
            recipes.push(newRecipe);
            res.redirect('/');
        } else {
            res.status(403).send('Senha incorreta');
        }
    } catch (error) {
        console.error('Erro ao adicionar receita:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/edit/:id', (req, res) => {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    if (recipe) {
        res.render('edit_recipe', { recipe });
    } else {
        res.status(404).send('Receita não encontrada');
    }
});

app.post('/edit/:id', (req, res) => {
    try {
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
    } catch (error) {
        console.error('Erro ao editar receita:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/delete/:id', (req, res) => {
    try {
        const password = req.query.password;
        if (verificarSenha(password)) {
            recipes = recipes.filter(r => r.id !== parseInt(req.params.id));
            res.redirect('/');
        } else {
            res.status(403).send('Senha incorreta');
        }
    } catch (error) {
        console.error('Erro ao deletar receita:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

module.exports = app;
