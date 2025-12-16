const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv'); // Importa o dotenv
dotenv.config(); // Carrega as variáveis do .env

const app = express();
const port = 3000; 

// Configuração de middlewares e serviço de arquivos estáticos
app.use(express.static('public')); 
app.use(cors()); 
app.use(express.json()); 

// Configuração do banco de dados (MYSQL)
const dbConfig = {
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE 
};

// Endpoints

// Rota de Cadastro
app.post('/api/cadastro', async (req, res) => {
    const { usuario, email, senha } = req.body;
    if (!usuario || !email || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'Todos os campos são obrigatórios.' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        const connection = await mysql.createConnection(dbConfig);
        const insertQuery = `INSERT INTO usuarios (nome_usuario, email, senha_hash) VALUES (?, ?, ?)`;
        await connection.execute(insertQuery, [usuario, email, senhaHash]);
        connection.end(); 
        
        res.status(201).json({ 
            sucesso: true, 
            mensagem: '✅ Usuário cadastrado com sucesso! Redirecionando para o login.' 
        });
    } catch (error) {
        console.error("Erro no cadastro:", error);
        if (error.errno === 1062) {
            return res.status(409).json({ sucesso: false, mensagem: '❌ O e-mail informado já está em uso.' });
        }
        res.status(500).json({ sucesso: false, mensagem: '❌ Erro interno do servidor ou falha de conexão com o banco de dados.' });
    }
});

// Rota de Login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(
            'SELECT nome_usuario, senha_hash FROM usuarios WHERE email = ?',
            [email]
        );
        const usuario = rows[0];

        if (!usuario) {
            return res.status(401).json({ sucesso: false, mensagem: 'Email ou senha incorretos.' });
        }
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ sucesso: false, mensagem: 'Email ou senha incorretos.' });
        }

        res.status(200).json({ 
            sucesso: true, 
            mensagem: `Bem-vindo(a), ${usuario.nome_usuario}!`,
            nomeUsuario: usuario.nome_usuario // Retorna o nome para o front-end salvar na sessão
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor ao tentar realizar o login.' });
    } finally {
        if (connection) connection.end();
    }
});

// Rota de Alterar Senha
app.post('/api/alterar-senha', async (req, res) => {
    const { nomeUsuario, novaSenha } = req.body; 

    if (!nomeUsuario || !novaSenha) {
        return res.status(400).json({ sucesso: false, mensagem: 'Dados incompletos para alterar a senha.' });
    }
    let connection;
    try {
        // Criptografa a nova senha
        const salt = await bcrypt.genSalt(10);
        const novaSenhaHash = await bcrypt.hash(novaSenha, salt);
        connection = await mysql.createConnection(dbConfig);

        // Encontrar o usuário pelo nome
        const [result] = await connection.execute(
            'UPDATE usuarios SET senha_hash = ? WHERE nome_usuario = ?',
            [novaSenhaHash, nomeUsuario]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado para alteração de senha.' });
        }
        res.status(200).json({ 
            sucesso: true, 
            mensagem: '🔑 Senha alterada com sucesso! Você será desconectado(a).' 
        });
    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        // Garante que o front-end receba um JSON de erro
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor ao tentar alterar a senha.' });
    } finally {
        if (connection) connection.end();
    }
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`🔗 Acesse o Front-end: http://localhost:${port}/index.html`);
    console.log(`=================================================\n`);
});