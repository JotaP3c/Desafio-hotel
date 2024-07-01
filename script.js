let pessoas = [
  { nome: "Fulano - dados default", documento: "123456", telefone: "99123 4567" },
  { nome: "Ciclano - dados default", documento: "654321", telefone: "99876 5432" }
];

let checkIns = [
{ pessoa: pessoas[0], dataEntrada: "2024-06-28T08:00:00", dataSaida: "2024-06-30T10:17:00", adicionalVeiculo: true },
{ pessoa: pessoas[1], dataEntrada: "2024-06-27T08:00:00", dataSaida: null, adicionalVeiculo: false,  }
];

let checkinsArquivados = []

const dataAtual = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

function calcularValorEstadia(checkIn) {
let dataEntrada = new Date(checkIn.dataEntrada);
let dataSaida = checkIn.dataSaida ? new Date(checkIn.dataSaida) : new Date();


if (dataSaida.getHours() > 16 || (dataSaida.getHours() === 16 && dataSaida.getMinutes() >= 30)) {
  dataSaida.setDate(dataSaida.getDate() + 1); 
}

let diasTotais = Math.ceil((dataSaida - dataEntrada) / (1000 * 60 * 60 * 24)); 
let custoTotal = 0;

for (let i = 0; i < diasTotais; i++) {
  let dia = new Date(dataEntrada.getTime() + i * 24 * 60 * 60 * 1000);
  let diaSemana = dia.getDay(); 

  if (diaSemana === 5 || diaSemana === 6) {
    custoTotal += 150;
  } else { 
    custoTotal += 120;
  }
  
  if (checkIn.adicionalVeiculo) {
    console.log(`debug custo: ${custoTotal}`)
    if (diaSemana === 5 || diaSemana === 6) { 
      custoTotal += 20;
    } else {
      custoTotal += 15;
    }
  }
}

return custoTotal;
}

function preencherFormularioEdicao(index) {
const checkIn = checkIns[index];
document.getElementById('editNome').value = checkIn.pessoa.nome;
document.getElementById('editDocumento').value = checkIn.pessoa.documento;
document.getElementById('editTelefone').value = checkIn.pessoa.telefone;
document.getElementById('editAdicionalVeiculo').checked = checkIn.adicionalVeiculo;
document.getElementById('editDataEntrada').value = checkIn.dataEntrada.substring(0, 10); 
document.getElementById('editDataSaida').value = checkIn.dataSaida ? checkIn.dataSaida.substring(0, 10) : ''; 

document.getElementById('formulario').style.display = 'none';
document.getElementById('formularioEditar').style.display = 'block';


document.getElementById('editIndex').value = index;
}

function salvarEdicao() {
const index = document.getElementById('editIndex').value;
const nome = document.getElementById('editNome').value;
const documento = document.getElementById('editDocumento').value;
const telefone = document.getElementById('editTelefone').value;
const adicionalVeiculo = document.getElementById('editAdicionalVeiculo').checked;
const dataEntrada = document.getElementById('editDataEntrada').value;
const dataSaida = document.getElementById('editDataSaida').value;

if (dataEntrada > dataSaida) {
  return alert('A data de entrada não pode ser maior que a de saída.');
}
if (nome && documento && telefone && adicionalVeiculo !== '') {
  let checkInEditado = {
    pessoa: { nome, documento, telefone, adicionalVeiculo },
    dataEntrada,
    dataSaida: dataSaida || null,
    adicionalVeiculo
  };

  checkIns[index] = checkInEditado;
  exibirPessoas();
  cancelarEdicao();
} else {
  alert('Por favor, preencha todos os campos.');
}
}

function cancelarEdicao() {
document.getElementById('formularioEditar').style.display = 'none';
document.getElementById('formulario').style.display = 'block';

document.getElementById('editNome').value = '';
document.getElementById('editDocumento').value = '';
document.getElementById('editTelefone').value = '';
document.getElementById('editAdicionalVeiculo').checked = false;
document.getElementById('editDataEntrada').value = '';
document.getElementById('editDataSaida').value = '';
}


// Interprete essa função abaixo como a operação DELETE pls =)

function arquivarRegistros(index){

let checkinArquivado = checkIns.splice(index, 1)[0];
checkinsArquivados.push(checkinArquivado)
exibirPessoas() 
}

function exibirPessoas() {
const lista = document.getElementById('lista');
lista.innerHTML = '';

checkIns.forEach((checkIn, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${checkIn.pessoa.nome}</strong> - ${checkIn.pessoa.documento} - ${checkIn.pessoa.telefone} <button type="button" onclick="preencherFormularioEdicao(${index})" aria-label="Editar">✏️</button> <button type="button" onclick="arquivarRegistros(${index})" aria-label="Remover">🗑️</button>`;
    lista.appendChild(li);
});

}

function listarPessoasArquivadas() {
const lista = document.getElementById('pessoasArquivadasNoHotel');
lista.innerHTML = '';

checkinsArquivados.forEach(checkIn => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${checkIn.pessoa.nome}</strong> - ${checkIn.pessoa.documento} - ${checkIn.pessoa.telefone}`;
    lista.appendChild(li);
});
}

function adicionarCheckin() {
const nome = document.getElementById('nome').value;
const documento = document.getElementById('documento').value;
const telefone = document.getElementById('telefone').value;
const adicionalVeiculo = document.getElementById('adicionalVeiculo').value;
const dataEntrada = document.getElementById('dataEntrada').value;
const dataSaida = document.getElementById('dataSaida').value;

if(dataEntrada > dataSaida){
  return alert('A data de entrada não pode ser menor que a de saída.');
}
if (nome && documento && telefone && adicionalVeiculo) {
  let novoCheckin = {pessoa: { nome, documento, telefone, adicionalVeiculo }, dataEntrada, dataSaida, adicionalVeiculo};
  checkIns.push(novoCheckin);
  exibirPessoas();
  limparFormulario();
} else {
  alert('Por favor, preencha todos os campos.');
}
}

function limparFormulario() {
document.getElementById('nome').value = '';
document.getElementById('documento').value = '';
document.getElementById('telefone').value = '';
document.getElementById('adicionalVeiculo').checked = false;
document.getElementById('DataEntrada').value = '';
document.getElementById('DataSaida').value = '';
}

function buscarPessoa() {
const nomeBusca = document.getElementById('buscarNome').value.toLowerCase();
const documentoBusca = document.getElementById('buscarDocumento').value.toLowerCase();

const pessoasFiltradas = checkIns.filter(checkin => {
  const nomeCheckin = checkin.pessoa.nome.toLowerCase();
  const documentoCheckin = checkin.pessoa.documento.toLowerCase();

  if (nomeBusca && !documentoBusca) {
    return nomeCheckin.includes(nomeBusca);
  } else if (!nomeBusca && documentoBusca) {
    return documentoCheckin.includes(documentoBusca);
  } else if (nomeBusca && documentoBusca) {
    return nomeCheckin.includes(nomeBusca) && documentoCheckin.includes(documentoBusca);
  } else {
    return true;
  }
});

const lista = document.getElementById('lista');
lista.innerHTML = '';

pessoasFiltradas.forEach((checkin, index )=> {
  const li = document.createElement('li');
  li.innerHTML = `<strong>${checkin.pessoa.nome}</strong> - ${checkin.pessoa.documento} - ${checkin.pessoa.telefone} <button type="button" onclick="preencherFormularioEdicao(${index})" aria-label="Editar">✏️</button> <button type="button" onclick="arquivarRegistros(${index})" aria-label="Remover">🗑️</button>`;
  lista.appendChild(li);
});
}

function listarPessoasNoHotel() {
const pessoasNoHotel = checkIns.filter(checkIn => !checkIn.dataSaida || checkIn.dataSaida > dataAtual); 
const lista = document.getElementById('pessoasNoHotel');
lista.innerHTML = '';


pessoasNoHotel.forEach(checkIn => {
    const li = document.createElement('li');

    li.innerHTML = `<strong>${checkIn.pessoa.nome}</strong> - CPF: ${checkIn.pessoa.documento} - Telefone: ${checkIn.pessoa.telefone} - R$ ${calcularValorEstadia(checkIn)}`;
    lista.appendChild(li);
});
}

function listarPessoasForaDoHotel() {
const pessoasForaDoHotel = checkIns.filter(checkIn => checkIn.dataSaida < dataAtual); 
const lista = document.getElementById('pessoasNoHotel');
lista.innerHTML = '';

pessoasForaDoHotel.forEach(checkIn => {
    const li = document.createElement('li');

    li.innerHTML = `<strong>${checkIn.pessoa.nome}</strong> - CPF: ${checkIn.pessoa.documento} - Telefone: ${checkIn.pessoa.telefone} - R$ ${calcularValorEstadia(checkIn)}`;
    lista.appendChild(li);
});
}


//Tomara que tudo isso funcione de boa, quando eu testei de boa :)
