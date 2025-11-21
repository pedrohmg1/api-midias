const express = require("express");
const CD = require("../models/cd");

const router = express.Router();

// lista todos
router.get("/", async (req, res) => {
  try {
    const cds = await CD.find().populate("autor");
    res.json(cds);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar CDs" });
  }
});

// lista por id
router.get("/:id", async (req, res) => {
  try {
    const cd = await CD.findById(req.params.id).populate("autor");
    if (!cd) return res.status(404).json({ error: "CD não encontrado" });
    res.json(cd);
  } catch (error) {
    res.status(400).json({ error: "ID inválido" });
  }
});

// cria
router.post("/", async (req, res) => {
  try {
    const novoCD = await CD.create(req.body);
    res.status(201).json(novoCD);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar CD" });
  }
});

// atualiza
router.put("/:id", async (req, res) => {
  try {
    const atualizado = await CD.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!atualizado)
      return res.status(404).json({ error: "CD não encontrado" });

    res.json(atualizado);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar CD" });
  }
});

// deleta
router.delete("/:id", async (req, res) => {
  try {
    const removido = await CD.findByIdAndRemove(req.params.id);
    if (!removido)
      return res.status(404).json({ error: "CD não encontrado" });

    res.json({ message: "CD removido com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao remover CD" });
  }
});

module.exports = router;
