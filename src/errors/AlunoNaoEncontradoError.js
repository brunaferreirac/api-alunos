import ApiError from "./ApiError.js";

export default class AlunoNaoEncontradoError extends ApiError {
  constructor(message = "Aluno não encontrado", statusCode = 404) {
    super(message, statusCode);
  }
}
