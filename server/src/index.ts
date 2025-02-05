import 'reflect-metadata'
import { AppDataSource } from './data-source'
import { User } from './entity/User'
import express from 'express'
import home from './routes/home'
import crawler from './routes/crawler'
import user from './routes/user'
import cors from 'cors'
import { verifyToken } from './middlewares/auth'
import { createServer } from 'http'
import { Server } from 'socket.io'

AppDataSource.initialize()
  .then(async () => {
    // console.log('Inserting a new user into the database...')
    // const user = new User()
    // user.firstName = 'Timber'
    // user.lastName = 'Saw'
    // user.age = 25
    // await AppDataSource.manager.save(user)
    // console.log('Saved a new user with id: ' + user.id)

    // console.log('Loading users from the database...')
    // const users = await AppDataSource.manager.find(User)
    // console.log('Loaded users: ', users)

    const app = express()
    const server = createServer(app)
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    })
    const PORT = 3000
    app.set('io', io)
    app.use(cors())
    app.use(express.json())
    app.use(home)
    app.use('/api/v1/user', user)
    app.use(verifyToken)
    app.use('/api/v1/crawler', crawler)

    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`)
    })

    io.on('connection', (socket) => {
      console.log('a user connected')
      socket.on('disconnect', () => {
        console.log('user disconnected')
      })
    })
  })
  .catch((error) => console.log(error))
