const mongoose = require("mongoose");

const AutorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    nacionalidade: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Autor", AutorSchema);
