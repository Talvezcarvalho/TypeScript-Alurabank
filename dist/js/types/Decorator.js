export function ValidaDebito(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (valorDoDebito) {
        if (valorDoDebito <= 0) {
            throw new Error('O valor do débito deve ser maior que zero');
        }
        if (valorDoDebito > this.saldo) {
            throw new Error('Saldo insuficiente');
        }
        return originalMethod.apply(this, [valorDoDebito]);
    };
    return descriptor;
}
export function ValidaDeposito(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (valorDoDeposito) {
        if (valorDoDeposito <= 0) {
            throw new Error('O valor do depósito deve ser maior que zero');
        }
        return originalMethod.apply(this, [valorDoDeposito]);
    };
    return descriptor;
}
// Define um decorator de método chamado LogTempo
export function LogTempo(target, propertyKey, descriptor) {
    // Guarda uma referência ao método original
    const originalMethod = descriptor.value;
    // Substitui o método original por uma nova função
    descriptor.value = function (...args) {
        // Obtém o tempo inicial
        const startTime = Date.now();
        // Chama o método original com os argumentos originais
        const result = originalMethod.apply(this, args);
        // Obtém o tempo final
        const endTime = Date.now();
        // Calcula a diferença em milissegundos
        const duration = endTime - startTime;
        // Registra o tempo de execução no console
        console.log(`O método ${propertyKey} levou ${duration} ms para executar.`);
        // Retorna o resultado original
        return result;
    };
    // Retorna o descritor modificado
    return descriptor;
}
// Define um decorator de método chamado ValidaString
export function ValidaString(target, propertyKey, descriptor) {
    // Guarda uma referência ao método original
    const originalMethod = descriptor.value;
    // Substitui o método original por uma nova função
    descriptor.value = function (valor) {
        // Verifica se o valor é uma string
        if (typeof valor !== "string") {
            // Se não for, lança um erro
            throw new Error("O valor deve ser uma string!");
        }
        // Se for, chama o método original com o valor como argumento
        return originalMethod.apply(this, [valor]);
    };
    // Retorna o descritor modificado
    return descriptor;
}
