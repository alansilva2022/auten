export interface Transacao {
    tipo: 'emprestimo' | 'devolucao';
    livroNome: string;
    usuarioNome: string;
    data: string;
    quantidadeLivros: number;
    livroId?: string;
    usuarioId: string;
    usuarioLogado: string;
}


