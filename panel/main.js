import { clientes } from './clientes.js';
import { produtos } from './produtos.js';


window.onload = function () {
    const clientesBtn = document.querySelector("#clientes-btn");
    const produtosBtn = document.querySelector("#produtos-btn");
    const pedidosBtn = document.querySelector("#pedidos-btn");

    let formClientes = document.querySelector("#form-clientes");
    let formProdutos = document.querySelector("#form-produtos");
    let formPedidos = document.querySelector("#form-pedidos");
    let fecharBtn = document.querySelectorAll(".fechar-btn");


    let clientesInp = document.querySelectorAll(".clientes");
    let produtosInp = document.querySelectorAll(".produtos");
    let contCliente = 0;
    let contProduto = 0;
    let anteriorBtn = document.querySelectorAll(".btn-anterior");
    let proximoBtn = document.querySelectorAll(".btn-proximo");
    let novoBtn = document.querySelectorAll(".novo");
    let salvarBtn = document.querySelectorAll(".salvar");
    
    let pedidoCodigoInp = document.querySelector("#pedido-codigo");
    let pedidoClienteInp = document.querySelector("#pedido-cliente");
    let codigoProdutoInp = document.querySelector("#codigo-mini-form");
    let descricaoProdutoInp = document.querySelector("#descricao-mini-form");
    let precoProdutoInp = document.querySelector("#preco-mini-form");
    let quantidadeProdutoInp = document.querySelector("#qtd-mini-form");
    let lancarPedidoBtn = document.querySelector("#add-mini-form");
    let tabelaPedido = document.querySelector("#table-produto");
    let subtotalBox = document.querySelector("#sub-total-table");

    function Pedido(codigo, descricao, preco, qtd){
        this.Item = Number(codigo);
        this.Descricao = descricao;
        this.Preco = "R$ "+ Number(preco).toFixed(2);
        this.Quantidade = Number(qtd);
        this.Subtotal = "R$ "+ (Number(qtd)*Number(preco)).toFixed(2);
    }

    function tempCliente (codigo, nome, data) {
        this.codCliente = Number(codigo);
        this.nomeCliente = nome;
        this.dataCadCli = data;
      }

    function tempProduto (codigo, nome, preco, quantidade) {
        this.codProduto = Number(codigo);
        this.descProduto = nome;
        this.precoProduto = Number(preco);
        this.qtdEstoqueProd = Number(quantidade);
      }    



    AtivarForm();


    renderObjetos(contCliente, clientesInp, clientes);
    renderObjetos(contProduto, produtosInp, produtos);

    Novo(novoBtn[1], produtosInp, produtos);
    Novo(novoBtn[0], clientesInp, clientes);
    
    Salvar(salvarBtn[0], clientesInp, clientes, contCliente, tempCliente, "cliente");
    Salvar(salvarBtn[1], produtosInp, produtos, contProduto, tempProduto, "produto");
    
    AnteriorProximo(anteriorBtn[0],proximoBtn[0], contCliente, clientesInp, clientes);
    AnteriorProximo(anteriorBtn[1], proximoBtn[1], contProduto, produtosInp, produtos);
    



    pedidoCodigoInp.addEventListener('blur', function(){
        let clienteExiste = "false";
        for(let cliente of clientes){
            if(cliente.codCliente == pedidoCodigoInp.value){
                clienteExiste = "true";
            }
        }
        if(clienteExiste == "true"){
                pedidoClienteInp.value = clientes[Number(pedidoCodigoInp.value)-1].nomeCliente;
        } else{
            alert("Cliente não existe!");
            pedidoClienteInp.value = "";
        }
    })

    codigoProdutoInp.addEventListener('blur', function () {
        let produtoExiste = "false";
        for (let produto of produtos) {
            if (produto.codProduto == codigoProdutoInp.value) {
                produtoExiste = "true";
            }
        }
        if (produtoExiste == "true") {
            descricaoProdutoInp.value = produtos[Number(codigoProdutoInp.value) - 1].descProduto;
            precoProdutoInp.value = produtos[Number(codigoProdutoInp.value) - 1].precoProduto;
        } else {
            alert("Produto não existe!");
            descricaoProdutoInp.value = "";
            precoProdutoInp.value = "";
        }
    })

    lancarPedidoBtn.addEventListener('click', function(){
        let quantidadeDisponível = 0;
        let indexProduto = 0;
        for(let produto of produtos){
            if(codigoProdutoInp.value == produto.codProduto){
                quantidadeDisponível = produto.qtdEstoqueProd;
                indexProduto = produto.codProduto;
            }
        }

        let novoPedido = new Pedido(codigoProdutoInp.value, descricaoProdutoInp.value, precoProdutoInp.value, quantidadeProdutoInp.value)
        let novoRow = document.createElement("tr");

        if(quantidadeProdutoInp.value > quantidadeDisponível){
            alert(`Não temos essa quantidade disponível em estoque. A quantidade que temos é ${quantidadeDisponível}.`)
        } else {
            produtos[indexProduto-1].qtdEstoqueProd = produtos[indexProduto-1].qtdEstoqueProd - quantidadeProdutoInp.value;
            
            for(let info in novoPedido){
                let novoInfo = document.createElement("td");
                novoInfo.innerHTML = novoPedido[info];
                
                novoRow.appendChild(novoInfo);
            }
        }

        tabelaPedido.appendChild(novoRow);
        let consertoTotal = Number(novoPedido.Subtotal.replace("R$ ","")) + Number(subtotalBox.innerHTML.replace("R$ ",""));
        subtotalBox.innerHTML = "R$ "+ consertoTotal.toFixed(2);
    })


    FecharFormulario(fecharBtn[0]);
    FecharFormulario(fecharBtn[1]);
    FecharFormulario(fecharBtn[2]);



    function Novo(botao, inputs, objeto){
            botao.addEventListener('click', function(){
                for(let caixas of inputs){
                    caixas.value = "";
                }
                inputs[0].value = objeto.length + 1;
                if(inputs.length == 3){
                    let data = new Date()
                    inputs[2].value = data.toLocaleString('pt-BR', {year:'numeric', month:'2-digit', day:'2-digit'});                
                }
            })
        }

    function Salvar(botao, inputs, objetos, contadorFormulario, novoObjeto, tipoObjeto){
        botao.addEventListener('click', function () {
            let usadoCodigo = "false";
            for (let objeto of objetos) {
                let contador = 0
                for (let item in objeto) {
                    if (inputs[contador].value == objeto[item]) {
                        usadoCodigo = "true";
                    }
                    break
                }
            }
            let inputVazio = "false";
            let idVazio = [];
            for(let caixa of inputs){
                if(caixa.value == ""){
                    inputVazio = "true";
                    idVazio.push(caixa.name);
                }
            }
            if (usadoCodigo != "true" && inputVazio == "false") {
                
                if(tipoObjeto == "cliente"){
                    let registroNovo = new novoObjeto(inputs[0].value, inputs[1].value, inputs[2].value);
                    objetos.push(registroNovo);
                } else if (tipoObjeto == "produto"){
                    let registroNovo = new novoObjeto(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value);
                    objetos.push(registroNovo);
                }
                
                alert("Dados cadastrados com sucesso.");
                contadorFormulario = 0;
                renderObjetos(contadorFormulario, inputs, objetos);
            } else if(usadoCodigo != "true" && inputVazio == "true"){
                alert(`Insira um ${idVazio.toString()}!`);
                
            } else{
                alert("Clique em 'Novo' para criar um registro!")
            }
        })
            
    }

    function renderObjetos(indexObjeto, atualInput, arrayObjetos) {
        let objeto = arrayObjetos[indexObjeto];
        let interval = 0;

        for (let info in objeto) {
            atualInput[interval].value = objeto[info];
            interval++;
        }
    }

    function AtivarForm() {
        

        clientesBtn.addEventListener("click", function () {
            formClientes.style.display = "block";
            formProdutos.style.display = "none";
            formPedidos.style.display = "none";
        });
        produtosBtn.addEventListener("click", function () {
            formClientes.style.display = "none";
            formProdutos.style.display = "block";
            formPedidos.style.display = "none";
        });
        pedidosBtn.addEventListener("click", function () {
            formClientes.style.display = "none";
            formProdutos.style.display = "none";
            formPedidos.style.display = "block";
        });
    }

    function FecharFormulario(botao) {
        botao.addEventListener('click', function () {
            formClientes.style.display = "none";
            formProdutos.style.display = "none";
            formPedidos.style.display = "none";
        });
    }

    function AnteriorProximo(botao, botao2, contador, input, objeto){

        botao.addEventListener('click', function(){
            if(contador > 0){
                contador--;
                renderObjetos(contador, input, objeto);
            } else if(contador == 0){
                alert("Fim de Registro!");
            }
        });
        
        botao2.addEventListener('click', function(){
            if(contador < (objeto.length - 1)){
                contador++;
                renderObjetos(contador, input, objeto);
            } else if(contador == (objeto.length - 1)){
                alert("Fim de Registro!");
            }
    });
}

}