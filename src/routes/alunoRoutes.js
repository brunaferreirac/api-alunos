import { Router } from "express";
import alunoController from "../controllers/alunoController.js";

const router = Router();

router.get("/alunos", alunoController.findMany);
router.post("/alunos", alunoController.create);
router.get("/alunos/:id", alunoController.findUnique);
router.put("/alunos/:id", alunoController.update);
router.delete("/alunos/:id", alunoController.delete);

export default router;
