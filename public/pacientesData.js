/**
 * @type {Array} Inicializa os arrays de pacientes
 */
let pacientes = [];
let pacientesAtendidos = [];

/**
 * @type {string|null} Armazena o CPF do paciente em edição para referência
 */
let pacienteEmEdicaoCPF = null;

/**
 * @type {string|null} Armazena o CPF do paciente em atendimento
 */
let pacienteEmAtendimentoCPF = null;

/**
 * Gera a chave de armazenamento específica para o usuário logado.
 * @param {string} tipo - 'fila' ou 'atendidos'
 * @returns {string} Chave completa do localStorage
 */
function gerarChave(tipo) {
    const usuario = getUsuarioLogado(); // Obtém o usuário
    if (!usuario) {
        console.error("Erro: Nenhum usuário logado para gerar a chave de dados.");
        return `anonimo_pacientes_${tipo}`;
    }
    return `${usuario.toLowerCase()}_pacientes_${tipo}`;
}

/**
 * Carrega os pacientes do localStorage
 * @param {string} tipo - 'fila' ou 'atendidos'.
 * @returns {Array} Array de pacientes ou array vazio
 */
function carregarPacientes(tipo) {
    const key = gerarChave(tipo);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : []; 
}

/**
 * Salva os pacientes no localStorage
 * @param {string} tipo - 'fila' ou 'atendidos'.
 * @param {Array} array - Array de pacientes a ser salvo
 */
function salvarPacientes(tipo, array) {
    const key = gerarChave(tipo);
    localStorage.setItem(key, JSON.stringify(array));
}