import prisma from "../prisma.js";
import AlunoInvalidoError from "../errors/AlunoInvalidoError.js";
import AlunoNaoEncontradoError from "../errors/AlunoNaoEncontradoError.js";

class AlunoService {
  async create(dados) {
    const { nome, email } = dados || {};
    if (!nome || !email) {
      throw new AlunoInvalidoError("Nome e email são obrigatórios");
    }
    return prisma.aluno.create({ data: { nome, email } });
  }

  async findMany(page, pageSize, orderBy, order) {
    // Só aceita campos que existem; qualquer outro valor cai no padrão "id"
    const camposPermitidos = ["id", "nome", "email", "createdAt"];
    const campo = camposPermitidos.includes(orderBy) ? orderBy : "id";
    // Qualquer valor diferente de "desc" (inclusive inválido) vira "asc"
    const direcao = order === "desc" ? "desc" : "asc";

    const [alunos, total] = await Promise.all([
      prisma.aluno.findMany({
        skip: (page - 1) * pageSize,
        take: Number(pageSize),
        orderBy: { [campo]: direcao },
      }),
      prisma.aluno.count(),
    ]);

    return { alunos, total };
  }

  async findUnique(id) {
    const aluno = await prisma.aluno.findUnique({ where: { id: Number(id) } });
    if (!aluno) {
      throw new AlunoNaoEncontradoError();
    }
    return aluno;
  }
}

export default new AlunoService();
