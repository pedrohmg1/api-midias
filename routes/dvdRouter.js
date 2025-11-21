const express = require("express");
const DVD = require("../models/dvd");

const router = express.Router();

// lista todos
router.get("/", async (req, res) => {
  try {
    const dvds = await DVD.find().populate("autor");
    res.json(dvds);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar DVDs" });
  }
});

// lista por id
router.get("/:id", async (req, res) => {
  try {
    const dvd = await DVD.findById(req.params.id).populate("autor");
    if (!dvd) return res.status(404).json({ error: "DVD não encontrado" });
    res.json(dvd);
  } catch (error) {
    res.status(400).json({ error: "ID inválido" });
  }
});

// cria
router.post("/", async (req, res) => {
  try {
    const novoDVD = await DVD.create(req.body);
    res.status(201).json(novoDVD);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar DVD" });
  }
});

// atualiza
router.put("/:id", async (req, res) => {
  try {
    const atualizado = await DVD.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!atualizado)
      return res.status(404).json({ error: "DVD não encontrado" });

    res.json(atualizado);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar DVD" });
  }
});

// deleta
router.delete("/:id", async (req, res) => {
  try {
    const removido = await DVD.findByIdAndRemove(req.params.id);
    if (!removido)
      return res.status(404).json({ error: "DVD não encontrado" });

    res.json({ message: "DVD removido com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao remover DVD" });
  }
});

module.exports = router;
