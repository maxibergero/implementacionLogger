import { userModel } from "../models/users.models.js";

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        if(users){
            let cont = 0
            users.forEach(user => {
                cont += 1
                req.logger.debug(`User(${cont}): ${user}`)
            });
        }
        res.status(200).send({ respuesta: 'OK', mensaje: users })
    } catch (error) {
        req.logger.fatal(`Error en consultar usuarios: ${error}`)
        res.status(400).send({ respuesta: 'Error en consultar usuarios', mensaje: error })
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user) {
            req.logger.debug(`User(getUserById): ${user}`)
            res.status(200).send({ respuesta: 'OK', mensaje: user })
        } else {
            res.status(404).send({ respuesta: 'Error en consultar usuario', mensaje: 'User not Found' })
        }
    } catch (error) {
        req.logger.fatal(`Error en consultar usuario: ${error}`)
        res.status(400).send({ respuesta: 'Error en consultar usuario', mensaje: error })
    }
}

export const putUserById = async (req, res) => {
    const { id } = req.params
    const { nombre, apellido, edad, email, password } = req.body
    req.logger.info(`Datos para actualizar: \n Id: ${id} \n Nombre: ${nombre} \n Apellido: ${apellido} \n Edad: ${edad} \n Email: ${email} \n Password: ${password}`)
    try {
        const user = await userModel.findByIdAndUpdate(id, { nombre, apellido, edad, email, password })
        if (user) {
            req.logger.debug(`User(putUserById): ${user}`)
            res.status(200).send({ respuesta: 'OK', mensaje: user })
        } else {
            res.status(404).send({ respuesta: 'Error en actualizar usuario', mensaje: 'User not Found' })
        }
    } catch (error) {
        req.logger.fatal(`Error en actualizar usuario: ${error}`)
        res.status(400).send({ respuesta: 'Error en actualizar usuario', mensaje: error })
    }
}

export const deleteUserById = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            req.logger.debug(`User(deleteUserById): ${user}`)
            res.status(200).send({ respuesta: 'OK', mensaje: user })
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar usuario', mensaje: 'User not Found' })
        }
    } catch (error) {
        req.logger.fatal(`Error en eliminar usuario: ${error}`)
        res.status(400).send({ respuesta: 'Error en eliminar usuario', mensaje: error })
    }
}