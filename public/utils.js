/**
 * Calcula a idade com base na data de nascimento e a formata YYYY-MM-DD
 * @param {string} dataNasc
 * @returns {number}
 */
function calcularIdade(dataNasc) {
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

/**
 * Formata o CPF (11 dígitos numéricos) para o padrão XXX.XXX.XXX-XX
 * @param {string} cpf
 * @returns {string}
 */
function formatarCPF(cpf) {
    if (cpf.length !== 11) return cpf;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Função para exibir a mensagem de feedback (sucesso/erro) na tela
 * @param {string} mensagem
 * @param {string} tipo
 * @param {string} idElemento
 */
function exibirFeedback(mensagem, tipo, idElemento) {
    const resultadoElemento = document.getElementById(idElemento);
    if (!resultadoElemento) return;
    resultadoElemento.classList.remove('hidden');
    resultadoElemento.innerHTML = mensagem;

    // Define o estilo com base no tipo
    if (tipo === 'error') {
        resultadoElemento.style.backgroundColor = '#ffe5e5';
        resultadoElemento.style.color = '#a94442';
        resultadoElemento.style.borderColor = '#ebccd1';
    } else {
        resultadoElemento.style.backgroundColor = '#dff0d8';
        resultadoElemento.style.color = '#3c763d';
        resultadoElemento.style.borderColor = '#d6e9c6';
    }
}