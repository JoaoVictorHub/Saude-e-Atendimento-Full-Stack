// Adiciona um novo paciente à fila, validando os dados
function adicionarPaciente() {
    const nomeInput = document.getElementById('nomeInput').value.trim();
    const dataNascimentoInput = document.getElementById('dataNascimentoInput').value;
    const cpfInput = document.getElementById('cpfInput').value.trim();
    const servicoInput = document.getElementById('servicoInput').value;
    
    // As funções utilitárias são assumidas como carregadas
    const idade = calcularIdade(dataNascimentoInput); 
    const dataHoraRegistro = new Date();
    let classificacao = '';

    // Validações de Entrada
    const nomeRegex = /^[a-zA-Z\sÀ-ÖØ-öø-ÿ]+$/;
    if (nomeInput === "" || !nomeRegex.test(nomeInput)) {
        exibirFeedback('⚠️ Por favor, insira um Nome válido (apenas letras).', 'error', 'resultado');
        return;
    }
    if (!dataNascimentoInput || idade < 0 || idade > 150) {
        exibirFeedback('⚠️ Data de Nascimento inválida ou futura.', 'error', 'resultado');
        return;
    }
    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(cpfInput)) {
        exibirFeedback('⚠️ Por favor, insira um CPF válido (11 dígitos numéricos).', 'error', 'resultado');
        return;
    }
    if (servicoInput === "") {
        exibirFeedback('⚠️ Por favor, Selecione o Serviço/Atendimento.', 'error', 'resultado');
        return;
    }
    
    // Verifica se o CPF já está registrado na fila
    const cpfFormatado = formatarCPF(cpfInput);
    if (pacientes.find(p => p.cpf === cpfFormatado)) {
        exibirFeedback(`⚠️ Paciente com CPF ${cpfFormatado} já registrado na fila de espera.`, 'error', 'resultado');
        return;
    }

    // Lógica de Classificação por Idade
    if (idade <= 11) {
        classificacao = '👶 Criança';
    } else if (idade >= 12 && idade <= 17) {
        classificacao = '🧑👧 Adolescente';
    } else if (idade >= 18 && idade <= 59) {
        classificacao = '👨👩‍🦰 Adulto/a';
    } else {
        classificacao = '👴🧓 Idoso/a';
    }

    // Cria o objeto do novo paciente
    const novoPaciente = {
        nome: nomeInput,
        idade: idade,
        cpf: cpfFormatado,
        servico: servicoInput,
        categoria: classificacao,
        dataRegistro: dataHoraRegistro.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    };

    // Adiciona e Salva (usa a chave 'fila')
    pacientes.push(novoPaciente);
    salvarPacientes('fila', pacientes); 

    // Limpa o formulário
    document.getElementById('nomeInput').value = '';
    document.getElementById('dataNascimentoInput').value = '';
    document.getElementById('cpfInput').value = '';
    document.getElementById('servicoInput').value = '';
    
    exibirFeedback(`✅ Paciente ${nomeInput} (${idade} anos) registrado com sucesso!`, 'success', 'resultado');
    exibirPacientes(); // Atualiza a visualização
}

/**
 * @param {string} cpf Inicia o modo de edição: preenche o formulário e troca os botões.
 */
function iniciarEdicao(cpf) {
    const paciente = pacientes.find(p => p.cpf === cpf);
    if (!paciente) return;

    pacienteEmEdicaoCPF = cpf;
    document.getElementById('nomeInput').value = paciente.nome;
    // O CPF é armazenado formatado e removemos a formatação para o input
    document.getElementById('cpfInput').value = paciente.cpf.replace(/[^0-9]/g, ''); 
    document.getElementById('servicoInput').value = paciente.servico;
    // Desativa campos de ID (CPF e Data de Nascimento) que não devem ser alterados na edição
    document.getElementById('cpfInput').disabled = true; 
    document.getElementById('dataNascimentoInput').disabled = true;
    // Troca dos Botões (De Registro Para Salvar Edição)
    document.getElementById('btnRegistrar').classList.add('hidden');
    document.getElementById('btnSalvarEdicao').classList.remove('hidden');
    exibirFeedback(`✏️ Editando paciente ${paciente.nome}. Altere o Nome e/ou Serviço e clique em SALVAR EDIÇÃO.`, 'error', 'resultado');
}

// Salva as alterações feitas no paciente e reverte o formulário para o modo de registro
function salvarEdicao() {
    if (!pacienteEmEdicaoCPF) return;
    const pacienteIndex = pacientes.findIndex(p => p.cpf === pacienteEmEdicaoCPF);
    if (pacienteIndex === -1) return;

    // Captura os novos valores
    const novoNome = document.getElementById('nomeInput').value.trim();
    const novoServico = document.getElementById('servicoInput').value;
    
    // Valida a Edição para Nome e Serviço
    const nomeRegex = /^[a-zA-Z\sÀ-ÖØ-öø-ÿ]+$/;
    if (novoNome === "" || !nomeRegex.test(novoNome)) {
        exibirFeedback('⚠️ Por favor, insira um Nome válido.', 'error', 'resultado');
        return;
    }
    if (novoServico === "") {
        exibirFeedback('⚠️ Por favor, Selecione o Serviço/Atendimento.', 'error', 'resultado');
        return;
    }

    // Atualiza o objeto no array
    pacientes[pacienteIndex].nome = novoNome;
    pacientes[pacienteIndex].servico = novoServico;
    salvarPacientes('fila', pacientes); // Salva a fila

    // Limpa o formulário e restaura o modo de Registro
    pacienteEmEdicaoCPF = null;
    document.getElementById('nomeInput').value = '';
    document.getElementById('cpfInput').value = '';
    document.getElementById('servicoInput').value = '';
    document.getElementById('dataNascimentoInput').value = ''; 
    document.getElementById('cpfInput').disabled = false;
    document.getElementById('dataNascimentoInput').disabled = false;
    document.getElementById('btnRegistrar').classList.remove('hidden');
    document.getElementById('btnSalvarEdicao').classList.add('hidden');

    exibirFeedback(`✅ Paciente ${novoNome} editado com sucesso!`, 'success', 'resultado');
    exibirPacientes(); // Atualiza a visualização
}

/**
 * Função para excluir paciente da lista de espera.
 * @param {string} cpf - CPF do paciente a ser removido.
 */
function excluirPaciente(cpf) {
    const indice = pacientes.findIndex(p => p.cpf === cpf);
    if (indice !== -1) {
        const nomeRemovido = pacientes[indice].nome;
        pacientes.splice(indice, 1);
        salvarPacientes('fila', pacientes); // Salva a fila
        exibirFeedback(`🗑️ Paciente ${nomeRemovido} excluído da lista.`, 'success', 'resultado');
        exibirPacientes(); // Atualiza a visualização
    }
}

// Submissão por Enter no Formulário de Paciente
document.addEventListener('DOMContentLoaded', () => {
    const btnRegistrar = document.getElementById('btnRegistrar');
    if (btnRegistrar) {
        // Seleciona todos os inputs para reagir ao Enter
        const inputs = document.querySelectorAll('#nomeInput, #dataNascimentoInput, #cpfInput, #servicoInput');
        
        inputs.forEach(input => {
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    // Se for o último campo antes do botão, chama a função de registro
                    if (input.id === 'servicoInput') {
                         adicionarPaciente();
                    } else {
                        // Se não for o último, move o foco para o próximo campo
                        const currentIndex = Array.from(inputs).indexOf(input);
                        const nextInput = inputs[currentIndex + 1];
                        if (nextInput) {
                            nextInput.focus();
                        }
                    }
                }
            });
        });
    }
});