-- CreateTable
CREATE TABLE "Configuraciones" (
    "id_configuracion" SERIAL NOT NULL,
    "clave" VARCHAR(100) NOT NULL,
    "valor" VARCHAR(100) NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuraciones_pkey" PRIMARY KEY ("id_configuracion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Configuraciones_clave_key" ON "Configuraciones"("clave");

-- Semilla: valores por defecto. No pisan nada si ya existieran.
INSERT INTO "Configuraciones" ("clave", "valor", "fecha_actualizacion")
VALUES
  ('metodo_login', 'ambos', CURRENT_TIMESTAMP),
  ('modo_caja_default', 'sesion_inicial', CURRENT_TIMESTAMP)
ON CONFLICT ("clave") DO NOTHING;
