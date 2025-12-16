// Renderiza a lista de pacientes na fila, aplicando a prioridade (idosos)
function exibirPacientes() {
    const listaElemento = document.getElementById('listaPacientes');
    listaElemento.innerHTML = ''; 
    let pacientesOrdenados = [...pacientes]; // Cria uma cópia para ordenar

    // Lógica de Ordenação por Prioridade (Idosos primeiro)
    pacientesOrdenados.sort((a, b) => {
        const isAIdoso = a.idade >= 60;
        const isBIdoso = b.idade >= 60;

        if (isAIdoso && !isBIdoso) {
            return -1; // 'a' vem antes de 'b' (prioridade)
        }
        if (!isAIdoso && isBIdoso) {
            return 1; // 'b' vem antes de 'a' (prioridade)
        }
        return 0; // Mantém a ordem original entre pacientes da mesma categoria
    });

    pacientesOrdenados.forEach((paciente, index) => {
        const itemLista = document.createElement('li');
        const prioridadeIcone = paciente.idade >= 60 ? '🚨' : ''; // Ícone para idosos

        itemLista.innerHTML = `
            <div>
                ${prioridadeIcone} ${index + 1}. 
                ${paciente.nome} | CPF: ${paciente.cpf} | Idade: ${paciente.idade} anos | Serviço: ${paciente.servico} | Categoria: ${paciente.categoria}
                <br>
                <small>Registrado em: ${paciente.dataRegistro}</small>
            </div>
            <div class="acoes-lista">
                <button class="btn-atender" onclick="iniciarAtendimento('${paciente.cpf}')">Atender</button>
                <button class="btn-editar" onclick="iniciarEdicao('${paciente.cpf}')">Editar</button>
                <button class="btn-excluir" onclick="excluirPaciente('${paciente.cpf}')">Excluir</button>
            </div>
        `;
        listaElemento.appendChild(itemLista);
    });
    exibirPacientesAtendidos(); // Atualiza também a lista de atendidos
}

// Renderiza a lista de pacientes que já foram atendidos com suas avaliações
function exibirPacientesAtendidos() {
    const listaElemento = document.getElementById('listaAtendidos');
    listaElemento.innerHTML = ''; 

    pacientesAtendidos.forEach((paciente, index) => {
        const itemLista = document.createElement('li');
        itemLista.classList.add('atendido-item');
        itemLista.innerHTML = `
            <div>
                ${index + 1}. ${paciente.nome} | CPF: ${paciente.cpf} | Serviço: ${paciente.servico}
                <br>
                <small>
                    Idade: ${paciente.idade} anos | Categoria: ${paciente.categoria}
                    <br>
                    Registrado em: ${paciente.dataRegistro} | Atendido em: ${paciente.dataAtendimento}
                    <br>
                    Avaliação: Espera ${paciente.tempoEspera} | Serviço ${paciente.notaServico}
                </small>
            </div>
            <div class="acoes-lista">
                <button class="btn-relatorio-individual" onclick="imprimirComprovante('${paciente.cpf}')">Comprovante</button>
            </div>
        `;
        listaElemento.appendChild(itemLista);
    });
}

/**
 * Gera e imprime o comprovante individual de um paciente atendido.
 * @param {string} cpf - CPF do paciente.
 */
function imprimirComprovante(cpf) {
    const paciente = pacientesAtendidos.find(p => p.cpf === cpf);
    if (!paciente) return;

    // Conteúdo HTML estilizado para o comprovante
    const conteudoComprovante = `
        <div style="padding: 20px; border: 1px solid #ccc; max-width: 400px; margin: 20px auto; font-family: Arial;">
            <h4 style="text-align: center; color: #007bff;">Comprovante de Atendimento</h4>
            <hr>
            <p><strong>Nome:</strong> ${paciente.nome}</p>
            <p><strong>CPF:</strong> ${paciente.cpf}</p>
            <p><strong>Idade:</strong> ${paciente.idade} anos (${paciente.categoria})</p>
            <p><strong>Serviço Solicitado:</strong> ${paciente.servico}</p>
            <hr>
            <p><strong>Data/Hora de Registro:</strong> ${paciente.dataRegistro}</p>
            <p><strong>Data/Hora de Atendimento:</strong> ${paciente.dataAtendimento}</p>
            <hr>
            <p><strong>Avaliação:</strong></p>
            <ul>
                <li>Tempo de Espera: <strong>${paciente.tempoEspera}</strong></li>
                <li>Nota do Serviço: <strong>${paciente.notaServico}</strong></li>
            </ul>
        </div>
    `;

    // Abre uma nova janela para a impressão
    const janelaImpressao = window.open('', '', 'width=600,height=600');
    janelaImpressao.document.write('<html><head><title>Comprovante</title></head><body>');
    janelaImpressao.document.write(conteudoComprovante);
    janelaImpressao.document.write('</body></html>');
    janelaImpressao.document.close();
    janelaImpressao.print(); // Executa a impressão
}

// Gera e imprime o relatório geral de todos os pacientes atendidos, incluindo o nome do usuário logado
function imprimirRelatorioGeral() {
    if (pacientesAtendidos.length === 0) {
        exibirFeedback('⚠️ Não há pacientes atendidos para gerar o relatório.', 'error', 'resultado');
        return;
    }
    const usuario = getUsuarioLogado() || 'Usuário Desconhecido'; // Obtém o nome do usuário logado
    const dataHoraAtual = new Date().toLocaleString('pt-BR');

    // Estrutura o HTML do relatório
    let htmlRelatorio = `
        <div style="font-family: Arial; padding: 20px;" id="relatorio-content">
            <h2 style="text-align: center; color: #007bff;">Relatório Geral de Pacientes Atendidos</h2>
            <p style="text-align: center;">Gerado em: ${dataHoraAtual}, por ${usuario}.</p>
            <hr>
    `;

    pacientesAtendidos.forEach((paciente, index) => {
        htmlRelatorio += `
            <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 10px; border-radius: 4px;">
                <h4>${index + 1}. ${paciente.nome} (CPF: ${paciente.cpf})</h4>
                <p><strong>Serviço:</strong> ${paciente.servico} (${paciente.categoria})</p>
                <p><strong>Registro:</strong> ${paciente.dataRegistro} | <strong>Atendimento:</strong> ${paciente.dataAtendimento}</p>
                <p><strong>Avaliação:</strong> Espera: ${paciente.tempoEspera}, Serviço: ${paciente.notaServico}</p>
            </div>
        `;
    });
    htmlRelatorio += `</div>`;

    // Insere o relatório no elemento oculto e dispara a impressão
    const relatorioElemento = document.getElementById('print-relatorio-geral');
    relatorioElemento.innerHTML = htmlRelatorio;
    relatorioElemento.classList.remove('hidden');
    window.print();
    
    // Oculta o relatório novamente após a impressão
    setTimeout(() => {
        relatorioElemento.classList.add('hidden');
        relatorioElemento.innerHTML = '';
    }, 100);
}