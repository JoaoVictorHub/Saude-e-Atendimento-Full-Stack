const API_URL = 'http://localhost:3000/api';
const LOGGED_IN_KEY = 'sistema_usuario_logado_nome'; 

// Função para verificar o usuário logado
function getUsuarioLogado() {
    return sessionStorage.getItem(LOGGED_IN_KEY);
}

function checarLogin() {
    const usuarioLogado = getUsuarioLogado();
    
    if (usuarioLogado) {
        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('cadastro.html')) {
            window.location.href = 'atendimento.html';
        }
    } else {
        if (window.location.pathname.endsWith('atendimento.html')) {
            window.location.href = 'index.html';
        }
    }

    const usuarioElement = document.getElementById('usuarioLogadoNome');
    if (usuarioElement) {
        usuarioElement.innerText = usuarioLogado || 'Visitante';
    }
}

// Função de alterar senha
async function salvarNovaSenha() {
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmaNovaSenha = document.getElementById('confirmaNovaSenha').value;
    const nomeUsuario = getUsuarioLogado(); 
    const resultadoElementoId = 'senhaResultado'; // ID do div de feedback no modal

    // Limpa qualquer feedback anterior
    exibirFeedback('', 'none', resultadoElementoId); 

    if (!nomeUsuario) {
        exibirFeedback('⚠️ Nenhum usuário logado para alterar a senha.', 'error', resultadoElementoId);
        limparCamposModalAlterarSenha();
        return;
    }
    if (novaSenha.length < 8) {
        exibirFeedback('⚠️ A nova senha deve ter no mínimo 8 caracteres.', 'error', resultadoElementoId);
        return; 
    }
    if (novaSenha !== confirmaNovaSenha) {
        exibirFeedback('⚠️ As senhas não coincidem.', 'error', resultadoElementoId);
        return;
    }
    try {
        const response = await fetch(`${API_URL}/alterar-senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nomeUsuario: nomeUsuario,
                novaSenha: novaSenha
            })
        });
        if (response.ok) {
            const data = await response.json();
            
            // Exibe mensagem de sucesso
            exibirFeedback(data.mensagem, 'success', resultadoElementoId);
            limparCamposModalAlterarSenha(); // Limpa os inputs
            
            // Desloga e redireciona após 3 segundos
            setTimeout(() => {
                fecharModalAlterarSenha();
                deslogarUsuario(); 
            }, 3000); 
        } else {
            // Exibe a mensagem de erro da API
            const errorData = await response.json();
            exibirFeedback(`❌ Erro: ${errorData.mensagem}`, 'error', resultadoElementoId);
        }
    } catch (error) {
        // Erro de rede/servidor
        console.error('Erro na requisição de alteração de senha:', error);
        exibirFeedback('❌ Erro de conexão. Verifique se o servidor Node está rodando.', 'error', resultadoElementoId);
    }
}

function limparCamposModalAlterarSenha() {
    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmaNovaSenha').value = '';
}

function fecharModalAlterarSenha() {
    document.getElementById('modalAlterarSenha').classList.add('hidden');
    
    // Limpa o feedback ao fechar o modal
    const resultadoElemento = document.getElementById('senhaResultado');
    resultadoElemento.classList.add('hidden'); 
    resultadoElemento.innerHTML = '';
    resultadoElemento.style.backgroundColor = '';
    limparCamposModalAlterarSenha(); 
}

// Funções de login, cadastro, logout e modal
async function fazerLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;

    if (!email || !senha) {
        exibirFeedback('⚠️ Preencha email e senha.', 'error', 'authResultado');
        return;
    }
    try {
        exibirFeedback('⏳ Verificando credenciais...', 'info', 'authResultado');
        
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });
        const data = await response.json();

        if (data.sucesso) {
            sessionStorage.setItem(LOGGED_IN_KEY, data.nomeUsuario);
            exibirFeedback(data.mensagem, 'success', 'authResultado');
            
            setTimeout(() => {
                window.location.href = 'atendimento.html';
            }, 1000);
        } else {
            exibirFeedback(data.mensagem, 'error', 'authResultado');
        }
    } catch (error) {
        console.error('Erro de conexão com o servidor de login:', error);
        exibirFeedback('❌ Não foi possível conectar ao servidor. Verifique se o Node.js está rodando.', 'error', 'authResultado');
    }
}

async function fazerCadastro() {
    const usuario = document.getElementById('cadastroUsuario').value.trim();
    const email = document.getElementById('cadastroEmail').value.trim();
    const senha = document.getElementById('cadastroSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (!usuario || !email || !senha || !confirmarSenha) {
        exibirFeedback('⚠️ Por favor, preencha todos os campos.', 'error', 'authResultado');
        return;
    }
    if (senha !== confirmarSenha) {
        exibirFeedback('⚠️ As senhas não coincidem.', 'error', 'authResultado');
        return;
    }
    if (senha.length < 8) {
        exibirFeedback('⚠️ A senha deve ter no mínimo 8 caracteres.', 'error', 'authResultado');
        return;
    }
    try {
        exibirFeedback('⏳ Enviando dados para o servidor...', 'info', 'authResultado');
        
        const response = await fetch(`${API_URL}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, email, senha })
        });
        const data = await response.json();

        if (data.sucesso) {
            exibirFeedback(data.mensagem, 'success', 'authResultado');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            exibirFeedback(data.mensagem, 'error', 'authResultado');
        }
    } catch (error) {
        console.error('Erro de conexão com o servidor:', error);
        exibirFeedback('❌ Não foi possível conectar ao servidor de cadastro. Verifique se o Node.js está rodando.', 'error', 'authResultado');
    }
}

function deslogarUsuario() {
    sessionStorage.removeItem(LOGGED_IN_KEY);
    window.location.href = 'index.html'; 
}

function abrirModalAlterarSenha() {
    document.getElementById('menuUsuario').classList.add('hidden');
    document.getElementById('modalAlterarSenha').classList.remove('hidden');
    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmaNovaSenha').value = '';
    document.getElementById('senhaResultado').classList.add('hidden');
}

// Inicializa a checagem de login no carregamento da página
document.addEventListener('DOMContentLoaded', () => {
    checarLogin();
    
    const loginSenhaInput = document.getElementById('loginSenha');
    const loginEmailInput = document.getElementById('loginEmail');
    if (loginSenhaInput) {
        loginSenhaInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                fazerLogin();
            }
        });
        if(loginEmailInput) {
            loginEmailInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    fazerLogin();
                }
            });
        }
    }

    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    if (confirmarSenhaInput) {
        confirmarSenhaInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                fazerCadastro();
            }
        });
    }
});