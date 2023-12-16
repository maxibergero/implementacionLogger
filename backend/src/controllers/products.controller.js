import { productModel } from "../models/products.models.js";

//En controllers normalmente se hace metodo HTTP + Modelo para referirse al nombre del controlador
export const getProducts = async (req, res) => {
    const { limit, page, filter, sort } = req.query

    const pag = page ? page : 1
    const lim = limit ? limit : 10
    const ord = sort == 'asc' ? 1 : -1
    
    try {
        const prods = await productModel.paginate({ filter: filter }, { limit: lim, page: pag, sort: { price: ord } })

        

        if (prods) {
            //Necesito iterar por cada producto para mostrar los datos
            prods.docs.forEach(prod => {
                req.logger.debug(`Producto Consultado desde getProducts: \n ${prod}`)
            });
            return res.status(200).send(prods)
        }
        res.status(404).send({ error: "Productos no encontrados" })

    } catch (error) {
        req.logger.fatal(`Error en consultar productos: ${error}`)
        res.status(500).send({ error: `Error en consultar productos ${error}` })
    }

}

export const getProductById = async (req, res) => {
    const { id } = req.params

    req.logger.debug(`ID consultado: ${id}`)
    try {
        const prod = await productModel.findById(id)

        req.logger.debug(`Producto consultado: ${prod}`)

        if (prod) {
            return res.status(200).send(prod)
        }
        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        req.looger.fatal(`Error en consultar producto: ${error}`)
        res.status(500).send({ error: `Error en consultar producto ${error}` })
    }
}

export const postProduct = async (req, res) => {
    const { title, description, code, price, stock, category } = req.body

    req.logger.info(`Datos para crear producto: \n Title: ` + title + ` \n Description: ` + description + ` \n Code: ` + code + ` \n Price: ` + price + ` \n Stock: ` + stock + ` \n Category: ` + category)

    try {
        const prod = await productModel.create({ title, description, code, price, stock, category })


        if (prod) {
            req.logger.debug("Producto creado: " + prod)
            return res.status(201).send(prod)
        }

        res.status(400).send({ error: `Error en crear producto` })

    } catch (error) {
        if (error.code == 11000) { //error code es de llave duplicada
            req.logger.fatal(`Error en crear producto llave duplicada: ${error}`)
            return res.status(400).send({ error: "Producto ya creado con llave duplicada" })
        }

        req.logger.fatal(`Error en crear producto: ${error}`)
        res.status(500).send({ error: `Error en crear producto ${error}` })
    }
}

export const putProductById = async (req, res) => {
    const { id } = req.params
    const { title, description, code, price, stock, category } = req.body
    req.logger.debug("ID para actualizado: " + id)
    req.logger.info(`Producto datos para actualizar: \n Title: ` + title + ` \n Description: ` + description + ` \n Code: ` + code + ` \n Price: ` + price + ` \n Stock: ` + stock + ` \n Category: ` + category)
    try {
        const prod = await productModel.findByIdAndUpdate(id, { title, description, code, price, stock, category })

        if (prod) {
            req.logger.debug("Producto actualizado: " + prod)
            return res.status(200).send(prod)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        req.logger.fatal(`Error en actualizar producto: ${error}`)
        res.status(500).send({ error: `Error en actualizar producto ${error}` })
    }
}

export const deleteProductById = async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productModel.findByIdAndDelete(id)

        req.logger.debug(`Producto a eliminar: ${prod}`)

        if (prod) {
            return res.status(200).send(prod)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        req.logger.fatal(`Error en eliminar producto: ${error}`)
        res.status(500).send({ error: `Error en eliminar producto ${error}` })
    }
}