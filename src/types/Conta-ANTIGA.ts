import { Transacao } from "./transacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { ResumoTransacoes } from "./ResumoTransacoes.js";
let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0;

const transacoes: Transacao[] = JSON.parse(localStorage.getItem("transacoes"), (key: string, value:string) => {
    if (key === "data") {
        return new Date(value);
    }
    return value;
}) || [];

function debitar(valor: number) :void {
    if (valor <= 0) {
        throw new Error("Precisa ser maior que zero!");
    }
    if (valor > saldo) {
        throw new Error('Saldo insuficiente!');
    }
    saldo -= valor;
    localStorage.setItem("saldo", JSON.stringify(saldo));
}

function depositar(valor: number) :void {
    if (valor <= 0) {
        throw new Error("Precisa ser maior que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", JSON.stringify(saldo));

}

const Conta = { 
    getSaldo() {
        return saldo;
    },

    getDataAcesso(): Date {
        return new Date();
    },

    getResumoTransacoes() : ResumoTransacoes {
        const listaTransacoes: Transacao[] = structuredClone(transacoes);
        const resumoTransacoes: ResumoTransacoes = {
            totalDepositos:  0,
            totalPagamentos: 0,
            totalTransferencias: 0
        };
        listaTransacoes.forEach((transacao) => {
            switch (transacao.tipoTransacao) {
                case TipoTransacao.DEPOSITO:
                    resumoTransacoes.totalDepositos += transacao.valor;
                    break;
                case TipoTransacao.PAGAMENTO_BOLETO:
                    resumoTransacoes.totalPagamentos += transacao.valor;
                    break;
                case TipoTransacao.TRANSFERENCIA:
                    resumoTransacoes.totalTransferencias += transacao.valor;
                    break;
            }
        })
       
        return resumoTransacoes;
    },

    getGruposTransacoes():  GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = [];
        const listaTransacoes: Transacao[] = structuredClone(transacoes);
        const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((a, b) => b.data.getTime() - a.data.getTime());
        let labelAtualGrupoTransacao: string = "";

        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao: string = transacao.data.toLocaleDateString("pt-br", {month: "long", year: "numeric"});
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                })
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
    }
    return gruposTransacoes;
},
    registrarTransacao(novaTransacao : Transacao) : void{
        if (novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO || novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA) {
             debitar(novaTransacao.valor);
             novaTransacao.valor = -novaTransacao.valor;
        }
          else if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
         ; } 
          else {
            throw new Error("Tipo de transação inválido");
          }
          transacoes.push(novaTransacao);
          console.log(this.getGruposTransacoes());
          localStorage.setItem("transacoes", JSON.stringify(transacoes));
        }
}
export default Conta