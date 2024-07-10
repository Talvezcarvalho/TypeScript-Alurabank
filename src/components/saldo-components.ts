import { formatarData, formatarMoeda } from "../utils/Formatter.js";
import { FormatoData } from "../types/FormatoData.js";
import  Conta  from "../types/Conta.js";

const elementoSaldo = document.querySelector(".saldo-valor .valor") as HTMLElement;
const elementoDataAcesso = document.querySelector(".block-saldo time") as HTMLElement;


if (elementoDataAcesso) {
    elementoDataAcesso.textContent = formatarData(Conta.getDataAcesso(), FormatoData.DIA_SEMANA_DIA_MES_ANO);
}


renderizarSaldo();
 function renderizarSaldo(): void {
    if ( elementoSaldo ) {
        elementoSaldo.textContent = formatarMoeda(Conta.getSaldo());
    }
}

const SaldoComponent = { 
    atualizar() {
        console.log('atualizar saldo');
        renderizarSaldo();
    }
}

export default SaldoComponent;