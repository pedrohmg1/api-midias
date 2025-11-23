const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const auth = require("./auth");

const autorRouter = require("./routes/autorRouter");
const livroRouter = require("./routes/livroRouter");
const cdRouter = require("./routes/cdRouter");
const dvdRouter = require("./routes/dvdRouter");

const app = express();

// ⛔ Não use localhost no Railway — deixe aberto
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado"))
.catch(err => console.error("Erro no MongoDB:", err));


app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

// Middleware de auth
app.use((req, res, next) => {
  if (req.method === "GET") return next();
  auth(req, res, next);
});

app.use("/autores", autorRouter);
app.use("/livros", livroRouter);
app.use("/cds", cdRouter);
app.use("/dvds", dvdRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});

module.exports = app;
