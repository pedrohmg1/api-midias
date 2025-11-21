const mongoose = require("mongoose");

const LivroSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    preco: { type: Number, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "Autor", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Livro", LivroSchema);
