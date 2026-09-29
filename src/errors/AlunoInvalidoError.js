import ApiError from "./ApiError.js";

export default class AlunoInvalidoError extends ApiError {
  constructor(message = "Dados do aluno inválidos", statusCode = 400) {
    super(message, statusCode);
  }
}
