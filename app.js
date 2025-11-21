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


mongoose.connect("mongodb://localhost:27017/biblioteca", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


app.use(logger("dev"));
app.use(express.json()); 
app.use(cookieParser());



app.use((req, res, next) => {
  if (req.method === "GET") return next();
  return auth(req, res, next);
});


app.use("/autores", autorRouter);
app.use("/livros", livroRouter);
app.use("/cds", cdRouter);
app.use("/dvds", dvdRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
    console.log(`Frontend deve estar em http://localhost:5173`);
});


module.exports = app;
