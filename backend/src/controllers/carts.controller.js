import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

export const getCartById = async (req, res) => {
    
    const { id } = req.params
    

    try {
        const cart = await cartModel.findById(id)

        req.logger.debug(`Carrito consultado getCartByid: ${cart}`)
        if (cart)
            res.status(200).send({ respuesta: 'OK', mensaje: cart })
        else
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' })
    } catch (error) {
        req.logger.fatal(`Error en consulta carrito: ${error}`)
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error })
    }
}


export const postCart = async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    req.logger.info(`Carrito creado: \n Cid: ` + cid + ` \n Pid: ` + pid + ` \n Quantity: ` + quantity)

    try {
        const cart = await cartModel.findById(cid)
        req.logger.debug(`Carrito buscado (postCart): ${cart}`)
        if (cart) {
            const prod = await productModel.findById(pid) //Busco si existe en LA BDD, no en el carrito
            req.logger.debug(`Producto buscado (postCart): ${prod}`)
            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod._id.toHexString() == pid) //Busco si existe en el carrito
                if (indice != -1) {
                    cart.products[indice].quantity = quantity //Si existe en el carrito modifico la cantidad

                    if (quantity == 0) {
                        // Si la cantidad es cero, eliminamos el producto del array
                        cart.products.splice(indice, 1);
                    }
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity }) //Si no existe, lo agrego al carrito
                }
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart) //Actualizar el carrito

                req.logger.debug(`Carrito actualizado (postCart): ${respuesta}`)
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
            } else {
                res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Produt Not Found' })
            }
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Cart Not Found' })
        }

    } catch (error) {
        req.logger.fatal(`Error en agregar carrito: ${error}`)
        res.status(400).send({ respuesta: 'Error en agregar producto Carrito', mensaje: error })
    }
}