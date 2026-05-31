-- CreateEnum
CREATE TYPE "EstadoCaja" AS ENUM ('abierta', 'cerrada', 'auditoria');

-- CreateEnum
CREATE TYPE "ModoAutenticacion" AS ENUM ('sesion_inicial', 'por_venta');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ingreso_venta', 'ingreso_ajuste', 'egreso_retiro', 'egreso_ajuste_negativo', 'apertura', 'cierre');

-- CreateEnum
CREATE TYPE "MotivoCambioStock" AS ENUM ('venta', 'compra_proveedor', 'ajuste_inventario', 'devolucion', 'merma');

-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre_rol" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "funcionalidades" (
    "id_func" SERIAL NOT NULL,
    "nombre_func" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "funcionalidades_pkey" PRIMARY KEY ("id_func")
);

-- CreateTable
CREATE TABLE "roles_funcionalidades" (
    "id_rol" INTEGER NOT NULL,
    "id_func" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "roles_funcionalidades_pkey" PRIMARY KEY ("id_rol","id_func")
);

-- CreateTable
CREATE TABLE "trabajadores" (
    "id_trabajador" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "contrasena_hash" VARCHAR(255) NOT NULL,
    "hash_huella" VARCHAR(255),
    "id_rol" INTEGER NOT NULL,
    "permiso_manejo_caja" BOOLEAN NOT NULL DEFAULT false,
    "limite_retiro_diario" DECIMAL(10,2) NOT NULL,
    "fecha_registro" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trabajadores_pkey" PRIMARY KEY ("id_trabajador")
);

-- CreateTable
CREATE TABLE "productos" (
    "id_producto" SERIAL NOT NULL,
    "codigo_barras" VARCHAR(50) NOT NULL,
    "nombre_producto" VARCHAR(100) NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "costo_unitario" DECIMAL(10,2) NOT NULL,
    "stock_actual" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "ubicacion_almacen" VARCHAR(50),
    "fecha_ultima_compra" DATE,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "impuestos" (
    "id_impuesto" SERIAL NOT NULL,
    "nombre_impuesto" VARCHAR(50) NOT NULL,
    "porcentaje" DECIMAL(5,2) NOT NULL,
    "aplica_a_producto" BOOLEAN NOT NULL DEFAULT true,
    "aplica_a_servicio" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "impuestos_pkey" PRIMARY KEY ("id_impuesto")
);

-- CreateTable
CREATE TABLE "productos_impuestos" (
    "id_producto" INTEGER NOT NULL,
    "id_impuesto" INTEGER NOT NULL,

    CONSTRAINT "productos_impuestos_pkey" PRIMARY KEY ("id_producto","id_impuesto")
);

-- CreateTable
CREATE TABLE "cajas" (
    "id_caja" SERIAL NOT NULL,
    "id_trabajador_apertura" INTEGER NOT NULL,
    "fecha_hora_apertura" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto_inicial" DECIMAL(10,2) NOT NULL,
    "id_trabajador_cierre" INTEGER,
    "fecha_hora_cierre" TIMESTAMP,
    "monto_final_expected" DECIMAL(10,2) NOT NULL,
    "monto_final_real" DECIMAL(10,2),
    "estado" "EstadoCaja" NOT NULL DEFAULT 'abierta',
    "modo_autenticacion" "ModoAutenticacion" NOT NULL,

    CONSTRAINT "cajas_pkey" PRIMARY KEY ("id_caja")
);

-- CreateTable
CREATE TABLE "sesiones_vendedor" (
    "id_sesion" SERIAL NOT NULL,
    "id_caja" INTEGER NOT NULL,
    "id_trabajador" INTEGER NOT NULL,
    "fecha_hora_inicio" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_hora_fin" TIMESTAMP,

    CONSTRAINT "sesiones_vendedor_pkey" PRIMARY KEY ("id_sesion")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id_venta" SERIAL NOT NULL,
    "fecha_hora" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_trabajador" INTEGER NOT NULL,
    "id_caja" INTEGER NOT NULL,
    "total_neto" DECIMAL(10,2) NOT NULL,
    "impuestos" DECIMAL(10,2) NOT NULL,
    "total_bruto" DECIMAL(10,2) NOT NULL,
    "cambio_total" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id_venta")
);

-- CreateTable
CREATE TABLE "metodos_pago" (
    "id_metodo_pago" SERIAL NOT NULL,
    "nombre_metodo" VARCHAR(50) NOT NULL,
    "requiere_cambio" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "metodos_pago_pkey" PRIMARY KEY ("id_metodo_pago")
);

-- CreateTable
CREATE TABLE "detalle_pago_venta" (
    "id_detalle_pago" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_metodo_pago" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "cambio_devuelto" DECIMAL(10,2),

    CONSTRAINT "detalle_pago_venta_pkey" PRIMARY KEY ("id_detalle_pago")
);

-- CreateTable
CREATE TABLE "detalle_ventas" (
    "id_detalle" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario_moment" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_ventas_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "movimientos_caja" (
    "id_movimiento" SERIAL NOT NULL,
    "id_caja" INTEGER NOT NULL,
    "fecha_hora" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_movimiento" "TipoMovimiento" NOT NULL,
    "id_venta" INTEGER,
    "monto" DECIMAL(10,2) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "id_trabajador_registra" INTEGER NOT NULL,

    CONSTRAINT "movimientos_caja_pkey" PRIMARY KEY ("id_movimiento")
);

-- CreateTable
CREATE TABLE "arqueos_caja" (
    "id_arqueo" SERIAL NOT NULL,
    "id_caja" INTEGER NOT NULL,
    "fecha_hora" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto_contado_fisico" DECIMAL(10,2) NOT NULL,
    "monto_segun_sistema" DECIMAL(10,2) NOT NULL,
    "diferencia" DECIMAL(10,2) NOT NULL,
    "id_trabajador_realiza" INTEGER NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "arqueos_caja_pkey" PRIMARY KEY ("id_arqueo")
);

-- CreateTable
CREATE TABLE "historial_stock" (
    "id_historial_stock" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "fecha_hora" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidad_anterior" INTEGER NOT NULL,
    "cantidad_nueva" INTEGER NOT NULL,
    "id_trabajador" INTEGER NOT NULL,
    "motivo" "MotivoCambioStock" NOT NULL,
    "id_venta" INTEGER,

    CONSTRAINT "historial_stock_pkey" PRIMARY KEY ("id_historial_stock")
);

-- CreateTable
CREATE TABLE "estadisticas_mensuales" (
    "id_estadistica" SERIAL NOT NULL,
    "año" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "total_ventas_mes" DECIMAL(12,2) NOT NULL,
    "cantidad_transacciones" INTEGER NOT NULL,
    "productos_vendidos_total" INTEGER NOT NULL,

    CONSTRAINT "estadisticas_mensuales_pkey" PRIMARY KEY ("id_estadistica")
);

-- CreateTable
CREATE TABLE "log_ventas_huella" (
    "id_log" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_trabajador" INTEGER NOT NULL,
    "timestamp_huella" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_terminal" VARCHAR(45) NOT NULL,

    CONSTRAINT "log_ventas_huella_pkey" PRIMARY KEY ("id_log")
);

-- CreateIndex
CREATE UNIQUE INDEX "trabajadores_hash_huella_key" ON "trabajadores"("hash_huella");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigo_barras_key" ON "productos"("codigo_barras");

-- AddForeignKey
ALTER TABLE "roles_funcionalidades" ADD CONSTRAINT "roles_funcionalidades_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_funcionalidades" ADD CONSTRAINT "roles_funcionalidades_id_func_fkey" FOREIGN KEY ("id_func") REFERENCES "funcionalidades"("id_func") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trabajadores" ADD CONSTRAINT "trabajadores_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_impuestos" ADD CONSTRAINT "productos_impuestos_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_impuestos" ADD CONSTRAINT "productos_impuestos_id_impuesto_fkey" FOREIGN KEY ("id_impuesto") REFERENCES "impuestos"("id_impuesto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cajas" ADD CONSTRAINT "cajas_id_trabajador_apertura_fkey" FOREIGN KEY ("id_trabajador_apertura") REFERENCES "trabajadores"("id_trabajador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cajas" ADD CONSTRAINT "cajas_id_trabajador_cierre_fkey" FOREIGN KEY ("id_trabajador_cierre") REFERENCES "trabajadores"("id_trabajador") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_vendedor" ADD CONSTRAINT "sesiones_vendedor_id_caja_fkey" FOREIGN KEY ("id_caja") REFERENCES "cajas"("id_caja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_vendedor" ADD CONSTRAINT "sesiones_vendedor_id_trabajador_fkey" FOREIGN KEY ("id_trabajador") REFERENCES "trabajadores"("id_trabajador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_trabajador_fkey" FOREIGN KEY ("id_trabajador") REFERENCES "trabajadores"("id_trabajador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_caja_fkey" FOREIGN KEY ("id_caja") REFERENCES "cajas"("id_caja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pago_venta" ADD CONSTRAINT "detalle_pago_venta_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pago_venta" ADD CONSTRAINT "detalle_pago_venta_id_metodo_pago_fkey" FOREIGN KEY ("id_metodo_pago") REFERENCES "metodos_pago"("id_metodo_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_id_caja_fkey" FOREIGN KEY ("id_caja") REFERENCES "cajas"("id_caja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_id_trabajador_registra_fkey" FOREIGN KEY ("id_trabajador_registra") REFERENCES "trabajadores"("id_trabajador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arqueos_caja" ADD CONSTRAINT "arqueos_caja_id_caja_fkey" FOREIGN KEY ("id_caja") REFERENCES "cajas"("id_caja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arqueos_caja" ADD CONSTRAINT "arqueos_caja_id_trabajador_realiza_fkey" FOREIGN KEY ("id_trabajador_realiza") REFERENCES "trabajadores"("id_trabajador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_stock" ADD CONSTRAINT "historial_stock_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_stock" ADD CONSTRAINT "historial_stock_id_trabajador_fkey" FOREIGN KEY ("id_trabajador") REFERENCES "trabajadores"("id_trabajador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_stock" ADD CONSTRAINT "historial_stock_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_ventas_huella" ADD CONSTRAINT "log_ventas_huella_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_ventas_huella" ADD CONSTRAINT "log_ventas_huella_id_trabajador_fkey" FOREIGN KEY ("id_trabajador") REFERENCES "trabajadores"("id_trabajador") ON DELETE RESTRICT ON UPDATE CASCADE;
