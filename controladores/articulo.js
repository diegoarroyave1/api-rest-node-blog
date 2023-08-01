const path = require("path");
const fs = require("fs")
const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelo/Articulos");
const { error } = require("console");
const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "soy una accio de prueba en mi controlador de articulos"
    })
}

const curso = (req, res) => {
    console.log("se a ejecutado el end point");
    return res.status(200).send({
        curso: "reatc",
        autor: "diego",
        url: "diegojejejj"

    });
}


const crear = (req, res) => {

    let parametros = req.body;

    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "faltan datos por enviar"

        });
    }
    const articulo = new Articulo(parametros);

    articulo.save((error, articuloGuardado) => {

        if (error || !articuloGuardado) {
            return res.status(400).json({
                status: "error",
                mensaje: "no se ha guardado el articulos"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "articulo creado con exito"
        })
    });




}

const listar = (req, res) => {

   
        let consulta = Articulo.find({});

    if (req.params.ultimos) {
        consulta.limit(3)
    }

    consulta.sort({ fecha: -1 })
        .exec((error, articulos) => {
            if (error || !articulos) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "no se han encontrado articulos"
                });
            }

            return res.status(200).json({
                status: "success",
                parametro_url: req.params.ultimos,
                contador: articulos.length,
                articulos
            })
        })


    
}

const uno = (req, res) => {

    let id = req.params.id;
    Articulo.findById(id, (error, articulo) => {
        if (error || !articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "no se han encontrado articulos"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo
        })

    })

}

const borrar = (req, res) => {

    let articulo_id = req.params.id;

    Articulo.findOneAndDelete({ _id: articulo_id }, (error, articuloBorrado) => {

        if (error || !articuloBorrado) {

            return res.status(200).json({
                status: "error",
                mensaje: "error al borrar"
            })



        }

        return res.status(200).json({
            status: "success",
            mensaje: "metodo de borrar"
        })

    })


}


const editar = (req, res) => {
    let articulo_id = req.params.id;

    let parametros = req.body;
    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "faltan datos por enviar"

        });


    }

    Articulo.findOneAndUpdate({ _id: articulo_id }, req.body, { new: true }, (error, articulosActualizado) => {

        if (error || !articulosActualizado) {
            return res.status(500).json({
                status: "error",
                mensaje: "error al actualizar"

            });

        }

        return res.status(200).json({
            status: "success",
            articulo: articulosActualizado

        });

    })

}

const subir = (req, res) => {


    if (!req.file && !req.files) {
        return req.status(404).json({
            status: "error",
            mensaje: "peticion ivanlida"
        })
    }

    let archivo = req.file.originalname;
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];


    if (extension != "png" && extension != "jpg" &&
        extension != "jpeg" && extension != "gif") {

        fs.unlink(req.file.path, (error) => {
            return req.status(400).json({
                status: "error",
                mensaje: "imagen ivanlida"
            })
        })

    } else {

        let articuloId = req.params.id;

        Articulo.findOneAndUpdate({ _id: articuloId }, {imagen: req.file.filename}, { new: true }, (error, articulosActualizado) => {

            if (error || !articulosActualizado) {
                return res.status(500).json({
                    status: "error",
                    mensaje: "error al actualizar"

                });

            }

            return res.status(200).json({
                status: "success",
                articulo: articulosActualizado,
                fichero: req.file

            });

        })
    }


}

const imagen = ( req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/"+fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if(existe) {
            return res.sendFile(path.resolve(ruta_fisica))
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "la imagen no existe",
                existe,
                fichero,
                ruta_fisica
            })
        }    
    })
}
 const buscador = (req, res) => {
    let busqueda = req.params.busqueda;
    Articulo.find({"$or":[
        {"titulo" : {$regex: busqueda, "$options": "i"}},
        {"contenido" : {$regex: busqueda, "$options": "i"}},
        ]})
        .sort({fecha: -1})
        .exec((error, articulosEncontrados ) => {

            if(error || !articulosEncontrados || articulosEncontrados.length <= 0 ){
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontado articulos"
                })
                
            }

            return res.status(200).json({
                status: "success",
                articulos: articulosEncontrados
            })
        })
 }


module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}