import alunoService from "../services/alunoService.js";

class AlunoController {
  async create(request, response) {
    try {
      const aluno = await alunoService.create(request.body);
      return response.status(201).json({ aluno });
    } catch (e) {
      return response.status(e.statusCode || 500).json({ message: e.message });
    }
  }

  async findMany(request, response) {
    let { page, pageSize, orderBy, order } = request.query;
    page ||= 1;
    pageSize ||= 10;
    orderBy ||= "id";
    order ||= "asc";
    const { alunos, total } = await alunoService.findMany(page, pageSize, orderBy, order);
    return response.status(200).json({ alunos, total });
  }

  async findUnique(request, response) {
    try {
      const aluno = await alunoService.findUnique(request.params.id);
      return response.status(200).json({ aluno });
    } catch (e) {
      return response.status(e.statusCode || 500).json({ message: e.message });
    }
  }
}

export default new AlunoController();
