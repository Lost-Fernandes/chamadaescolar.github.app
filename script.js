// Lista de alunos e presenças
const alunos = JSON.parse(localStorage.getItem("alunos")) || [];

// Obter data e dia da semana
function obterDataEHorario() {
  const dataAtual = new Date();
  const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return dataAtual.toLocaleDateString('pt-BR', opcoes);
}

// Exibir data e dia no sistema
function exibirData() {
  const dataDiaDiv = document.getElementById("dataDia");
  dataDiaDiv.textContent = `Data: ${obterDataEHorario()}`;
}

// Exibir lista de alunos
function exibirLista() {
  const listaAlunos = document.getElementById("listaAlunos");
  listaAlunos.innerHTML = "";

  alunos.forEach((aluno, index) => {
    const alunoDiv = document.createElement("div");
    alunoDiv.classList.add("aluno");
    alunoDiv.classList.add(aluno.presente ? "presente" : "ausente");

    const nomeAluno = document.createElement("span");
    nomeAluno.textContent = `${aluno.nome} - Série: ${aluno.serie}`;

    const btnPresenca = document.createElement("button");
    btnPresenca.textContent = aluno.presente ? "Presente" : "Ausente";
    btnPresenca.onclick = () => marcarPresenca(index);

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.onclick = () => removerAluno(index);

    alunoDiv.appendChild(nomeAluno);
    alunoDiv.appendChild(btnPresenca);
    alunoDiv.appendChild(btnRemover);
    listaAlunos.appendChild(alunoDiv);
  });
}

// Adicionar aluno com nome e série
function adicionarAluno() {
  const nomeAluno = document.getElementById("nomeAluno").value.trim();
  const serieAluno = document.getElementById("serieAluno").value.trim();
  if (nomeAluno && serieAluno) {
    alunos.push({ nome: nomeAluno, serie: serieAluno, presente: false });
    document.getElementById("nomeAluno").value = "";
    document.getElementById("serieAluno").value = "";
    exibirLista();
    salvarDados();
  } else {
    alert("Por favor, insira o nome e a série do aluno.");
  }
}

// Remover aluno
function removerAluno(index) {
  alunos.splice(index, 1);
  exibirLista();
  salvarDados();
}

// Marcar presença ou ausência
function marcarPresenca(index) {
  alunos[index].presente = !alunos[index].presente;
  exibirLista();
}

// Salvar dados no localStorage
function salvarDados() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
  alert("Presenças salvas com sucesso!");
}

// Gerar relatório de presença
function gerarRelatorio() {
  const relatorioDiv = document.getElementById("relatorio");
  relatorioDiv.innerHTML = `<h3>Relatório de Presença - ${obterDataEHorario()}</h3>`;

  alunos.forEach(aluno => {
    const alunoInfo = document.createElement("p");
    alunoInfo.textContent = `${aluno.nome} - Série: ${aluno.serie}: ${aluno.presente ? "Presente" : "Ausente"}`;
    relatorioDiv.appendChild(alunoInfo);
  });
}

// Exportar dados para PDF
function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Adicionar título com data
  doc.setFontSize(16);
  doc.text(`Relatório de Presença de Alunos - ${obterDataEHorario()}`, 20, 20);

  // Adicionar dados dos alunos com nome e série
  doc.setFontSize(12);
  let y = 30;
  alunos.forEach(aluno => {
    const presenca = aluno.presente ? "Presente" : "Ausente";
    doc.text(`${aluno.nome} - Série: ${aluno.serie}: ${presenca}`, 20, y);
    y += 10;
  });

  // Baixar o PDF
  doc.save("presenca_alunos.pdf");
}

// Inicializar o sistema
exibirData();
exibirLista();
