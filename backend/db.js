// backend/db.js
//archivo  dedicado a la conexion de la base de datos. en sencarga de configurar la conexion del backend con la base de datos.
import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config'; // Carga tu archivo .env automáticamente

// 1. Configuramos el pool de conexión nativo de Postgres
// Aquí es donde se pasa de forma segura tu variable de entorno DATABASE_URL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Creamos el adaptador oficial exigido por Prisma 7
const adapter = new PrismaPg(pool);

// 3. Inicializamos PrismaClient pasando SOLO el adaptador
const prisma = new PrismaClient({ adapter });

export default prisma;
