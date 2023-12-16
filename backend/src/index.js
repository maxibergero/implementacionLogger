import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import initializePassport from './config/passport.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import router from './routes/index.routes.js'
import __dirname from './path.js'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import { addLogger } from './config/logger.js'


const whiteList = ['http://localhost:5173','http://127.0.0.1:5173', 'http://localhost:4000']

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) != -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Acceso denegado"))
        }
    }
}

//Configuración de Swagger

const swaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info: {
            title: 'API REST con Express y MongoDB',
            version: '1.0.0',
            description: "Api pensada para la aplicación Swagger"
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};
const specs = swaggerJsdoc(swaggerOptions)



const app = express()
const PORT = 4000


//BDD
mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('BDD conectada')
    })
    .catch(() => console.log('Error en conexion a BDD'))


//Middlewares
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser(process.env.SIGNED_COOKIE)) // La cookie esta firmada
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true, //Establezco que la conexion sea mediante URL
            useUnifiedTopology: true //Manego de clusters de manera dinamica
        },
        ttl: 60 //Duracion de la sesion en la BDD en segundos

    }),
    secret: process.env.SESSION_SECRET,
    resave: false, //Fuerzo a que se intente guardar a pesar de no tener modificacion en los datos
    saveUninitialized: false //Fuerzo a guardar la session a pesar de no tener ningun dato
}))

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//Logger 

app.use(addLogger)

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/', router)

//Server
app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})

