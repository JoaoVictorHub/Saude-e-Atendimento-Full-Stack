// Função para garantir que o usuário está logado ao acessar a página de atendimento
function checarAcesso() {
    // Redireciona se não houver um nome de usuário logado
    if (!getUsuarioLogado()) {
        window.location.href = 'index.html';
    }
}

// Inicializa o sistema, carregando dados do usuário logado e atualizando a interface
function inicializarSistema() {
    checarAcesso();
    // Carrega os dados específicos do usuário logado
    pacientes = carregarPacientes('fila');
    pacientesAtendidos = carregarPacientes('atendidos');

    // Exibe o nome do usuário logado na interface
    const usuarioLogado = getUsuarioLogado();
    const usuarioElement = document.getElementById('usuarioLogadoNome');
    if (usuarioElement) {
        usuarioElement.innerText = usuarioLogado;
    }
    // Exibe as listas carregadas do localStorage
    exibirPacientes();
}

// Inicia a aplicação após o carregamento do DOM
document.addEventListener('DOMContentLoaded', inicializarSistema);

// Abre/fecha o menu de opções do usuário
function exibirMenuUsuario() {
    document.getElementById('menuUsuario').classList.toggle('hidden');
}

// Abre o modal para alteração de senha
function abrirModalAlterarSenha() {
    document.getElementById('menuUsuario').classList.add('hidden');
    document.getElementById('modalAlterarSenha').classList.remove('hidden');
}

// Fecha o modal de alteração de senha
function fecharModalAlterarSenha() {
    document.getElementById('modalAlterarSenha').classList.add('hidden');
    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmaNovaSenha').value = '';
    document.getElementById('senhaResultado').classList.add('hidden');
}

/**
 * Abre o modal de atendimento e prepara para a avaliação.
 * @param {string} cpf - CPF do paciente a ser atendido.
 */
function iniciarAtendimento(cpf) {
    const paciente = pacientes.find(p => p.cpf === cpf);
    if (!paciente) return;
    
    // Armazena o CPF do paciente em atendimento
    pacienteEmAtendimentoCPF = cpf; 
    document.getElementById('pacienteAtendimentoNome').innerText = `Paciente: ${paciente.nome}`;
    document.getElementById('modalAtendimento').classList.remove('hidden');
}

// Fecha o modal de atendimento e limpa a referência
function fecharModalAtendimento() {
    document.getElementById('modalAtendimento').classList.add('hidden');
    pacienteEmAtendimentoCPF = null; // Limpa a referência global
}

// Finaliza o atendimento, move o paciente da fila para a lista de atendidos, e salva a avaliação
function finalizarAtendimento() {
    if (!pacienteEmAtendimentoCPF) return;

    // Captura os dados de avaliação
    const tempoEspera = document.getElementById('tempoEspera').value;
    const notaServico = document.getElementById('notaServico').value;
    const dataHoraAtendimento = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

    // Encontra e remove o paciente da lista de espera
    const pacienteIndex = pacientes.findIndex(p => p.cpf === pacienteEmAtendimentoCPF);
    if (pacienteIndex === -1) return;
    const pacienteAtendido = pacientes.splice(pacienteIndex, 1)[0]; // Remove e captura o objeto

    // Adiciona os dados de atendimento ao objeto
    pacienteAtendido.tempoEspera = tempoEspera;
    pacienteAtendido.notaServico = notaServico;
    pacienteAtendido.dataAtendimento = dataHoraAtendimento;
    pacientesAtendidos.push(pacienteAtendido); // Adiciona à lista de atendidos

    // Salva ambas as listas no localStorage
    salvarPacientes('fila', pacientes); 
    salvarPacientes('atendidos', pacientesAtendidos); 

    // Limpa e atualiza
    fecharModalAtendimento();
    exibirFeedback(`✅ Paciente ${pacienteAtendido.nome} atendido e avaliado com sucesso!`, 'success', 'resultado');
    exibirPacientes(); // Atualiza a visualização

    // Reseta as seleções do modal para o padrão
    document.getElementById('tempoEspera').value = 'Bom';
    document.getElementById('notaServico').value = 'Bom';
}