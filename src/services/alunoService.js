import prisma from "../prisma.js";
import AlunoInvalidoError from "../errors/AlunoInvalidoError.js";

class AlunoService {
  async create(dados) {
    const { nome, email } = dados || {};
    if (!nome || !email) {
      throw new AlunoInvalidoError("Nome e email são obrigatórios");
    }
    return prisma.aluno.create({ data: { nome, email } });
  }

  async findMany(page, pageSize) {
    const alunos = await prisma.aluno.findMany({
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
    });
    return alunos;
  }
}

export default new AlunoService();
