import local from 'passport-local' //Importo la estrategia
import GithubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import passport from 'passport'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import { userModel } from '../models/users.models.js'
import 'dotenv/config'

//Defino la estregia a utilizar
const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt //Extrar de las cookies el token



const initializePassport = () => {

    const cookieExtractor = req => {
        
        

        //En lugar de tomar de las cookies directamente todo de la peticion
        let token = req.headers.authorization ? req.headers.authorization : {}



        
        //Si token comienza con Bearer se quita. Se implenta para implementación de Swagger que en autorization devuelve
        // el req.headers.authorization con el Bearer delante,  distinto a como lo pasamos por poarte del cliente
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length)
        }

        req.logger.debug(`Token(cookieEstractor): ${token}`)

        return token

    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //El token va a venir desde cookieExtractor
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => { //jwt_payload = info del token (en este caso, datos del cliente)
        try {
            
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }

    }))


    
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            //Registro de usuario
            
            const { nombre, apellido, email, edad } = req.body

            req.logger.info(`Credenciales(register): \n Email: ${username} \n Password: ${password}`)

            

            try {
                const user = await userModel.findOne({ email: email })
                req.logger.degub(`User(register): ${user}`)
                if (user) {
                    //Caso de error: usuario existe
                    return done(null, false)
                }

                //Crear usuario

                const passwordHash = createHash(password)
                const userCreated = await userModel.create({
                    nombre: nombre,
                    apellido: apellido,
                    edad: edad,
                    email: email,
                    password: passwordHash
                })

                req.logger.info(`User(created): ${userCreated}`)
                return done(null, userCreated)

            } catch (error) {
                req.logger.fatal(`Error en registrar usuario: ${error}`)
                return done(error)
            }
        }))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, async (username, password, done) => {
            try {
                
                const user = await userModel.findOne({ email: username })

                if (!user) {
                    return done(null, false)
                }

                if (validatePassword(password, user.password)) {
                    return done(null, user)
                }

                return done(null, false)

            } catch (error) {
                return done(error)
            }
        }))


    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.SECRET_CLIENT,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(accessToken)
            console.log(refreshToken)
            console.log(profile._json)
            const user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                done(null, false)
            } else {
                const userCreated = await userModel.create({
                    nombre: profile._json.name,
                    apellido: ' ',
                    email: profile._json.email,
                    edad: 18, //Edad por defecto
                    password: createHash(profile._json.email + profile._json.name)
                })
                done(null, userCreated)
            }


        } catch (error) {
            done(error)
        }
    }))

    //Inicializar la session del user
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    //Eliminar la session del user
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport