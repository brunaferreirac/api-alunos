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

  async update(id, dados) {
    const { nome, email } = dados || {};

    // Corpo vazio = dado inválido. Reaproveita AlunoInvalidoError (400),
    // não precisa de exceção própria.
    if (!nome && !email) {
      throw new AlunoInvalidoError("Informe nome e/ou email para atualizar");
    }

    // Reaproveita AlunoNaoEncontradoError (404) se o id não existir
    await this.findUnique(id);

    if (email) {
      const existente = await prisma.aluno.findUnique({ where: { email } });
      if (existente && existente.id !== Number(id)) {
        // Email duplicado também reaproveita AlunoInvalidoError (com status 409,
        // que significa "conflito"), evitando criar uma classe só para isso.
        throw new AlunoInvalidoError("Email já cadastrado para outro aluno", 409);
      }
    }

    return prisma.aluno.update({
      where: { id: Number(id) },
      data: { ...(nome && { nome }), ...(email && { email }) },
    });
  }

  async delete(id) {
    await this.findUnique(id); // 404 se não existir
    await prisma.aluno.delete({ where: { id: Number(id) } });
  }
}

export default new AlunoService();
