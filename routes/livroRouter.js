const express = require("express");
const Livro = require("../models/livro");

const router = express.Router();

// lista todos
router.get("/", async (req, res) => {
  try {
    const livros = await Livro.find().populate("autor");
    res.json(livros);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar livros" });
  }
});

// lista por id
router.get("/:id", async (req, res) => {
  try {
    const livro = await Livro.findById(req.params.id).populate("autor");
    if (!livro) return res.status(404).json({ error: "Livro não encontrado" });
    res.json(livro);
  } catch (error) {
    res.status(400).json({ error: "ID inválido" });
  }
});

// cria
router.post("/", async (req, res) => {
  try {
    const novoLivro = await Livro.create(req.body);
    res.status(201).json(novoLivro);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar livro" });
  }
});

// atualiza
router.put("/:id", async (req, res) => {
  try {
    const atualizado = await Livro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!atualizado)
      return res.status(404).json({ error: "Livro não encontrado" });

    res.json(atualizado);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar livro" });
  }
});

// deleta
router.delete("/:id", async (req, res) => {
  try {
    const removido = await Livro.findByIdAndRemove(req.params.id);
    if (!removido)
      return res.status(404).json({ error: "Livro não encontrado" });

    res.json({ message: "Livro removido com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao remover livro" });
  }
});

module.exports = router;
