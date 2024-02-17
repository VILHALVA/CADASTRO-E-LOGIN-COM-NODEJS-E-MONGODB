const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Conectando ao banco de dados MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/registro', { useNewUrlParser: true, useUnifiedTopology: true });
const conexao = mongoose.connection;

conexao.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
conexao.once('open', () => {
  console.log('Conectado ao banco de dados MongoDB');
});

// Definindo o schema e o modelo para os documentos de clientes
const clienteSchema = new mongoose.Schema({
  email: String,
  senha: String
});
const Cliente = mongoose.model('Cliente', clienteSchema);

// Rota para o caminho raiz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/CODIGO.html'); // Envia o arquivo HTML
});

app.post('/formulario', async (req, res) => {
  const { email, senha } = req.body;
  if (req.body.cadastrar) {
    try {
      const hashedSenha = await bcrypt.hash(senha, 10);
      await Cliente.create({ email, senha: hashedSenha });
      console.log('Usuário cadastrado com sucesso');
      res.send('Usuário cadastrado com sucesso');
    } catch (err) {
      console.error('Erro ao cadastrar usuário: ', err);
      res.send('Erro ao cadastrar usuário');
    }
  } else if (req.body.login) {
    try {
      const cliente = await Cliente.findOne({ email });
      if (cliente && bcrypt.compareSync(senha, cliente.senha)) {
        console.log('Login bem-sucedido');
        res.send('Login bem-sucedido');
      } else {
        console.log('Email não encontrado ou senha incorreta');
        res.send('Email não encontrado ou senha incorreta');
      }
    } catch (err) {
      console.error('Erro ao realizar login: ', err);
      res.send('Erro ao realizar login');
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
