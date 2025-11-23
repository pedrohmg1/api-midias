const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path"); // <--- ADICIONADO AQUI: Importante para achar as pastas
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

// --- CÓDIGO DO FRONTEND (ADICIONADO) ---

// 1. Diz onde estão os arquivos do site (HTML/CSS/JS)
// O caminho segue a estrutura que vimos na sua imagem
app.use(express.static(path.join(__dirname, "catalogo-frontend", "catalogo-frontend", "dist")));

// 2. Rota "Coringa": Qualquer coisa que não for API, manda pro React
// Isso faz o site carregar quando entra na raiz
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "catalogo-frontend", "catalogo-frontend", "dist", "index.html"));
});

// --- FIM DO CÓDIGO DO FRONTEND ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});

module.exports = app;
