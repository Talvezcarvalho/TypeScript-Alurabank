import { Armazenador } from "./Armazenador.js";
import { ValidaDebito, ValidaDeposito } from "./Decorator.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { Transacao } from "./transacao.js";

export class Conta {
    nome: string
    private saldo: number = Armazenador.obter<number> ("saldo") || 0;	
    private transacoes: Transacao[] = Armazenador.obter<Transacao[]>(("transacoes"), (key: string, value: any) => {
        if (key === "data") {
            return new Date(value);
        }
        return value;
    }) || [];

    constructor(nome: string) {
        this.nome = nome;
    }
    public getTitular() {
        return this.nome;
    }

    public getGruposTransacoes():  GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = [];
        const listaTransacoes: Transacao[] = structuredClone(this. transacoes);
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
}
    public getSaldo() {
        return this.saldo;
    }
    public getDataAcesso(): Date {
        return new Date();
    }
    public registrarTransacao(novaTransacao : Transacao) : void{
        if (novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO || novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA) {
             this.debitar(novaTransacao.valor);
             novaTransacao.valor = -novaTransacao.valor;
        }
          else if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.valor);
         ; } 
          else {
            throw new Error("Tipo de transação inválido");
          }
          this.transacoes.push(novaTransacao);
          console.log(this.getGruposTransacoes());
          Armazenador.salvar("transacoes", JSON.stringify(this.transacoes));
        }
    @ValidaDeposito
    public depositar(valor: number) :void {
            if (valor <= 0) {
                throw new Error("Precisa ser maior que zero!");
            }
            this.saldo += valor;
            Armazenador.salvar("saldo", JSON.stringify(this.saldo));
        
        }
    @ValidaDebito
    public debitar(valor: number) :void {
            this.saldo -= valor;
            Armazenador.salvar("saldo", JSON.stringify(this.saldo));
        }
}

export class ContaPremium extends Conta {
    registrarTransacao(transacao: Transacao):void {
        if (transacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            console.log("Ganhou um bonus de 0.50 centavos")
            transacao.valor += 0.50;
            }
            super.registrarTransacao(transacao);
}
}

const conta = new Conta("Joana da Silva Oliveira");
const contaPremium = new ContaPremium("Gabriel Carvalho");
export default conta;