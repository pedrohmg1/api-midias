const express = require("express");
const Autor = require("../models/autor");

const router = express.Router();

// lista todos
router.get("/", async (req, res) => {
  try {
    const autores = await Autor.find();
    res.json(autores);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar autores" });
  }
});

// lista por id
router.get("/:id", async (req, res) => {
  try {
    const autor = await Autor.findById(req.params.id);
    if (!autor) return res.status(404).json({ error: "Autor não encontrado" });
    res.json(autor);
  } catch (error) {
    res.status(400).json({ error: "ID inválido" });
  }
});

// cria
router.post("/", async (req, res) => {
  try {
    const novoAutor = await Autor.create(req.body);
    res.status(201).json(novoAutor);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar autor" });
  }
});

// atualiza
router.put("/:id", async (req, res) => {
  try {
    const autorAtualizado = await Autor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!autorAtualizado)
      return res.status(404).json({ error: "Autor não encontrado" });

    res.json(autorAtualizado);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar autor" });
  }
});

// deleta
router.delete("/:id", async (req, res) => {
  try {
    const deletado = await Autor.findByIdAndRemove(req.params.id);

    if (!deletado)
      return res.status(404).json({ error: "Autor não encontrado" });

    res.json({ message: "Autor removido com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao remover autor" });
  }
});

module.exports = router;
