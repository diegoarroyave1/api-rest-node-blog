const express = require("express");
const multer = require("multer")
const ArticuloControler = require("../controladores/articulo");

const router = express.Router()

const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './imagenes/articulos/');
    },

    filename: function(req, file, cb){
        cb(null,"articulo" + Date.now() + file.originalname)


    }
})

const subida = multer({storage: almacenamiento})

router.get("/ruta-de-prueba", ArticuloControler.prueba);

router.get("/curso", ArticuloControler.curso);

router.post("/crear", ArticuloControler.crear);

router.get("/articulos/:ultimos?", ArticuloControler.listar);

router.get("/articulo/:id", ArticuloControler.uno);

router.delete("/articulo/:id", ArticuloControler.borrar);

router.put("/articulo/:id", ArticuloControler.editar);

router.post("/subir-imagen/:id",[subida.single("file0")],ArticuloControler.subir);

router.get("/imagen/:fichero", ArticuloControler.imagen);

router.get("/buscar/:busqueda", ArticuloControler.buscador);

module.exports = router;

