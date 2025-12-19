<h1 align="center"> 🏥 Saúde e Atendimento (Com Banco de Dados) </h1>

## 🚧 Sobre o Projeto

Este é um **Sistema Web Completo de Atendimento de Pacientes**, projetado para simular o fluxo de trabalho de uma clínica ou posto de saúde. Ele foi aperfeiçoado para se tornar uma aplicação **Full-Stack**, utilizando **JavaScript** tanto no Front-end quanto no Back-end (Node.js/Express) para garantir uma experiência de gerenciamento de fila eficiente e segura.

## 📁 Arquitetura e Funcionalidades Principais

O sistema combina persistência de dados no back-end (para a autenticação) e no front-end (para os dados de pacientes, que são isolados por usuário).

### Autenticação Segura (Back-end)
* **Cadastro:** Registra novos usuários com e-mail e senha, armazenando a senha de forma segura com **hashing (bcrypt)**.
* **Login:** Verifica o usuário e a senha comparando a *hash* armazenada.
* **Alteração de Senha:** Permite que o usuário logado altere sua senha, que é imediatamente criptografada e salva.
* **Segurança:** Utiliza um arquivo `.env` para proteger as credenciais de acesso ao banco de dados MySQL, garantindo que não sejam expostas no repositório.

### Gestão de Pacientes (Front-end/Local Storage)
* **Registro:** Permite cadastrar novos pacientes, calculando automaticamente a idade e a categoria (Criança, Adolescente, Adulto, Idoso).
* **Priorização Algorítmica (Ordenação):** A lista de espera é ordenada usando JavaScript, garantindo que pacientes **idosos (60+ anos)** sejam sempre exibidos no topo da fila, respeitando a prioridade legal e médica.
* **Atendimento e Avaliação:** Gerencia a transição do paciente da fila para a lista de atendidos, registrando o tempo de espera e a nota do serviço.
* **Relatórios:** Permite a impressão de um Comprovante Individual de Atendimento e um Relatório Geral.

## 🛠️ Tecnologias Utilizadas

A arquitetura do projeto é dividida entre o cliente (Front-end) e o servidor (Back-end) para garantir a segurança da autenticação e a persistência dos dados:

### Front-end (Cliente)
* **HTML:** Estrutura semântica e base de todos os formulários e interfaces.
* **CSS:** Estilização, layout e responsividade.
* **JavaScript:** Lógica de aplicação, manipulação do DOM e algoritmos de ordenação/priorização.

### Back-end (Servidor)
* **Node.js & Express:** Framework para criação das APIs REST (Cadastro, Login e Alteração de Senha).
* **MySQL:** Banco de dados relacional utilizado para persistir os dados dos usuários (Nome, Email e Senha Criptografada).
* **bcryptjs:** Biblioteca fundamental para a criptografia (hashing) segura das senhas antes de serem armazenadas no banco.
* **`mysql2/promise`:** Driver MySQL com suporte a `async/await` para operações assíncronas no banco de dados.

## ⚙️ Como Rodar o Projeto Localmente

### 1. Pré-requisitos
* **Node.js** instalado.
* **Servidor MySQL** instalado e rodando.

### 2. Configuração do Banco de Dados
* Acesse o MySQL (ex: Workbench, na linha de comando).
* Crie o banco de dados e a tabela:
    ```sql
    -- Cria o banco de dados
    CREATE DATABASE IF NOT EXISTS sistema_atendimento;
    
    -- Usa o banco de dados
    USE sistema_atendimento;
    
    -- Cria a tabela de usuários
    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome_usuario VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```
* **Atenção:** Crie o arquivo .env com suas credenciais (conforme a seção de segurança):
    ```
    # Se não tiver o dotenv, instale
    npm install dotenv
    
    # Exemplo de conteúdo do .env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=sua_senha_mysql_aqui
    DB_DATABASE=sistema_atendimento
    ```

### 3. Instalação e Execução do Servidor (Back-end)
* Navegue até o diretório raiz do projeto e instale as dependências:
    ```bash
    # Se não tiver o npm, instale
    npm install
    
    # Se já tiver
    npm init -y
    npm install express mysql2 bcryptjs cors
    ```
* Inicie o servidor Node.js/Express:
    ```bash
    node server.js
    ```
* Você deve ver a seguinte mensagem no console:
    ```
    =================================================
    🚀 Servidor rodando em http://localhost:3000
    🔗 Acesse o Front-end: http://localhost:3000/index.html
    =================================================
    ```

### 4. Acesso ao Front-end
* Abra o seu navegador e acesse a URL indicada no console:
    ```
    http://localhost:3000/index.html
    ```
* A partir daí, você pode realizar o cadastro de um novo usuário e começar a utilizar o sistema de atendimento.

## 🔎 Observações de Persistência de Dados
* **Dados de Usuário (Auth):** São persistidos no **MySQL** através do back-end, garantindo segurança e integridade das credenciais.
* **Dados de Pacientes (Fila/Atendidos):** São armazenados no `localStorage` do navegador. Esta abordagem simplifica a aplicação, mas os dados não são compartilhados entre diferentes dispositivos ou navegadores.
* **Isolamento de Dados:** A chave de armazenamento do `localStorage` é vinculada ao nome do usuário logado, garantindo que cada usuário gerencie sua própria lista de pacientes.
