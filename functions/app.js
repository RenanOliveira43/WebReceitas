const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let recipes = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { recipes });
});

app.get('/add', (req, res) => {
    res.render('add_recipe');
});

app.post('/add', (req, res) => {
    const { title, description } = req.body;
    recipes.push({ id: recipes.length + 1, title, description: description.replace(/\n/g, '<br>') });
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    res.render('edit_recipe', { recipe });
});

app.post('/edit/:id', (req, res) => {
    const { title, description } = req.body;
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    recipe.title = title;
    recipe.description = description.replace(/\n/g, '<br>');
    res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
    recipes = recipes.filter(r => r.id !== parseInt(req.params.id));
    res.redirect('/');
});

app.listen(port, () => {});
