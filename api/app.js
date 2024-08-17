const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sql } = require('@vercel/postgres');
const app = express();

const superSenha = '';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const verificarSenha = (senha) => senha === superSenha;

const createTable = async () => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS recipes (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("Tabela 'recipes' verificada/criada com sucesso.");
    } catch (error) {
        console.error('Erro ao criar/verificar tabela:', error);
    }
};

createTable();

app.get('/', async (req, res) => {
    try {
        const { rows: recipes } = await sql`SELECT * FROM recipes ORDER BY id ASC`;
        res.render('index', { recipes });
    } catch (error) {
        console.error('Erro ao buscar receitas:', error);
        res.status(500).send('Erro ao buscar receitas');
    }
});

app.get('/add', (req, res) => {
    res.render('add_recipe');
});

app.post('/add', async (req, res) => {
    try {
        const { title, description, password } = req.body;
        if (verificarSenha(password)) {
            await sql`
                INSERT INTO recipes (title, description)
                VALUES (${title}, ${description.replace(/\n/g, '<br>')})
            `;
            res.redirect('/');
        } else {
            res.status(403).send('Senha incorreta');
        }
    } catch (error) {
        console.error('Erro ao adicionar receita:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        const { rows } = await sql`SELECT * FROM recipes WHERE id = ${req.params.id}`;
        const recipe = rows[0];
        if (recipe) {
            res.render('edit_recipe', { recipe });
        } else {
            res.status(404).send('Receita não encontrada');
        }
    } catch (error) {
        console.error('Erro ao buscar receita:', error);
        res.status(500).send('Erro ao buscar receita');
    }
});

app.post('/edit/:id', async (req, res) => {
    try {
        const { title, description, password } = req.body;
        if (verificarSenha(password)) {
            await sql`
                UPDATE recipes
                SET title = ${title}, description = ${description.replace(/\n/g, '<br>')}
                WHERE id = ${req.params.id}
            `;
            res.redirect('/');
        } else {
            res.status(403).send('Senha incorreta');
        }
    } catch (error) {
        console.error('Erro ao editar receita:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        const password = req.query.password;
        if (verificarSenha(password)) {
            await sql`DELETE FROM recipes WHERE id = ${req.params.id}`;
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
