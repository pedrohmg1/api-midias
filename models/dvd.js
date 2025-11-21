const mongoose = require("mongoose");

const DVDSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    duracao: { type: Number, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "Autor", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DVD", DVDSchema);
