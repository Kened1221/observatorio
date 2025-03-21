-- CreateTable
CREATE TABLE "Departamento" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provincia" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "departamento_id" INTEGER NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distrito" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "provincia_id" INTEGER NOT NULL,

    CONSTRAINT "Distrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encuesta" (
    "id" SERIAL NOT NULL,
    "departamento_id" INTEGER NOT NULL,
    "provincia_id" INTEGER NOT NULL,
    "distrito_id" INTEGER NOT NULL,
    "rango_id" INTEGER NOT NULL,

    CONSTRAINT "Encuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rango" (
    "id" SERIAL NOT NULL,
    "edad_id" INTEGER NOT NULL,
    "poblacion_id" INTEGER NOT NULL,
    "ambito_ident" INTEGER NOT NULL,

    CONSTRAINT "Rango_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edad" (
    "id" SERIAL NOT NULL,
    "edadIntervalo" TEXT NOT NULL,

    CONSTRAINT "Edad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poblacion" (
    "id" SERIAL NOT NULL,
    "hombres" INTEGER NOT NULL,
    "mujeres" INTEGER NOT NULL,
    "rango_id" INTEGER NOT NULL,

    CONSTRAINT "Poblacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ambito" (
    "id" SERIAL NOT NULL,
    "rural" INTEGER NOT NULL,
    "urbano" INTEGER NOT NULL,
    "rango_id" INTEGER NOT NULL,

    CONSTRAINT "Ambito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_nombre_key" ON "Departamento"("nombre");

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distrito" ADD CONSTRAINT "Distrito_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "Provincia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encuesta" ADD CONSTRAINT "Encuesta_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encuesta" ADD CONSTRAINT "Encuesta_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "Provincia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encuesta" ADD CONSTRAINT "Encuesta_distrito_id_fkey" FOREIGN KEY ("distrito_id") REFERENCES "Distrito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encuesta" ADD CONSTRAINT "Encuesta_rango_id_fkey" FOREIGN KEY ("rango_id") REFERENCES "Rango"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rango" ADD CONSTRAINT "Rango_edad_id_fkey" FOREIGN KEY ("edad_id") REFERENCES "Edad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poblacion" ADD CONSTRAINT "Poblacion_rango_id_fkey" FOREIGN KEY ("rango_id") REFERENCES "Rango"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ambito" ADD CONSTRAINT "Ambito_rango_id_fkey" FOREIGN KEY ("rango_id") REFERENCES "Rango"("id") ON DELETE CASCADE ON UPDATE CASCADE;
