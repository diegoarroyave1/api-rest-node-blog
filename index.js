const {conexion} = require("./basedatos/conexion");
const express = require("express")
const cors = require("cors")

//iniciar app
console.log("app node arrancada");
//Conectar a la base de datos
conexion()
//crear servidor de node
const app = express();
const puerto = 3900;
//Configurar cors
app.use(cors());
//convertir body a objetojs
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//Crear rutas
const rutas_articulo = require('./routes/articulo')

app.use("/api", rutas_articulo);
app.get("/probando" , (req, res) => {
    console.log("se a ejecutado el end point");
    return res.status(200).send({
        curso:"reatc",
        autor:"diego",
        url:"diegojejejj"

    });
})
//Crear sevidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("servidor corriendo en el puerto"+puerto);
})