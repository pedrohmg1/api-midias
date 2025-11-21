const mongoose = require("mongoose");

const CDSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    genero: { type: String, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "Autor", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CD", CDSchema);
