const neto = require("net");

const server = neto.createServer((c) =>{
  console.log(`${c.remoteAddress} se ha conectado`);
  c.write(Buffer.from("conectado", "utf-8"));
  c.on("close", () => {
    console.log("DESCONECTADO");
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log("El servidor está inicializado en el puerto " + port));