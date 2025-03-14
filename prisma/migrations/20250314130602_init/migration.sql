-- CreateTable
CREATE TABLE "Encuesta" (
    "id" SERIAL NOT NULL,
    "totalParticipantes" INTEGER NOT NULL,

    CONSTRAINT "Encuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edad" (
    "id" SERIAL NOT NULL,
    "rango" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "Edad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sexo" (
    "id" SERIAL NOT NULL,
    "genero" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "Sexo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoPoblacion" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "TipoPoblacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nacionalidad" (
    "id" SERIAL NOT NULL,
    "pais" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "Nacionalidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distrito" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "Distrito_pkey" PRIMARY KEY ("id")
);
