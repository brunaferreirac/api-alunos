import { Router } from "express";
import alunoController from "../controllers/alunoController.js";

const router = Router();

router.get("/alunos", alunoController.findMany);
router.post("/alunos", alunoController.create);
router.get("/alunos/:id", alunoController.findUnique);

export default router;
