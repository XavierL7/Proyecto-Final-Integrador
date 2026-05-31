// db.js
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// 1. Cargamos las variables de entorno del archivo .env
dotenv.config()

// 2. Inicializamos el cliente de Prisma.
// En Prisma 7, le pasamos la URL del Session Pooling (puerto 5432) 
// directamente en la propiedad 'datasourceUrl'.
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

// 3. Exportamos la instancia para usarla en tus rutas y controladores
export default prisma