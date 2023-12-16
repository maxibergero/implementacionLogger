import { Router } from "express";



const loggerRouter = Router()

loggerRouter.get('/info', (req, res) => {
    req.logger.info("Prueba Info")
    res.send("Prueba Info")
})

loggerRouter.get('/warning', (req, res) => {
    req.logger.warning("Prueba Warning")
    res.send("Prueba Warning")
})

loggerRouter.get('/error', (req, res) => {
    req.logger.error("Prueba Error")
    res.send("Prueba Error")
})

loggerRouter.get('/fatal', (req, res) => {
    req.logger.fatal("Prueba Fatal")
    res.send("Prueba Fatal")
})






export default loggerRouter