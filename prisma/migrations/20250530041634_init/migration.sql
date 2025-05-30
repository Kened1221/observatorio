-- CreateEnum
CREATE TYPE "roleModule" AS ENUM ('inicio', 'objetivos', 'salud_nutricion', 'educacion', 'proteccion_social', 'servicios_basicos', 'desarrollo_economico', 'politica_incluir', 'normas_informes', 'notas_actualidad', 'participacion_ciudadana');

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "browser" TEXT,
    "browserVersion" TEXT,
    "os" TEXT,
    "osVersion" TEXT,
    "deviceType" TEXT,
    "deviceModel" TEXT,
    "language" TEXT,
    "browserId" TEXT,
    "ipAddress" TEXT,
    "city" TEXT,
    "country" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "closedAt" TIMESTAMP(3),
    "lastActive" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultModule" "roleModule"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "grupo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "dni" TEXT,
    "passwordHash" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "active" INTEGER NOT NULL DEFAULT 1,
    "date_inactive" TIMESTAMP(3),
    "roleId" TEXT,
    "overriddenModule" "roleModule"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "lastSentAt" BIGINT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

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
    "departamentoId" INTEGER NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distrito" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "provinciaId" INTEGER NOT NULL,
    "ubigeoDistrital" VARCHAR(10) NOT NULL,

    CONSTRAINT "Distrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id" SERIAL NOT NULL,
    "departamentoId" INTEGER NOT NULL,
    "provinciaId" INTEGER NOT NULL,
    "distritoId" INTEGER NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ambito" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Ambito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genero" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Genero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EdadIntervalo" (
    "id" SERIAL NOT NULL,
    "intervalo" VARCHAR(100) NOT NULL,

    CONSTRAINT "EdadIntervalo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoVivienda" (
    "id" SERIAL NOT NULL,
    "tipoVivienda" TEXT NOT NULL,

    CONSTRAINT "TipoVivienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poblacion" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "ambitoId" INTEGER NOT NULL,
    "edadIntervaloId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,

    CONSTRAINT "Poblacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avance" (
    "objetive" TEXT NOT NULL,
    "distritoId" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Vivienda" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "ambitoId" INTEGER NOT NULL,
    "tipoViviendaId" INTEGER NOT NULL,

    CONSTRAINT "Vivienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DificultadFisica" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "dificultad" VARCHAR(100) NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "ambitoId" INTEGER NOT NULL,
    "edadIntervaloId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,

    CONSTRAINT "DificultadFisica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoAfiliacion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "TipoAfiliacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AfiliacionSalud" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "ambitoId" INTEGER NOT NULL,
    "edadIntervaloId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,
    "tipoAfiliacionId" INTEGER NOT NULL,

    CONSTRAINT "AfiliacionSalud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoCaracteristica" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "TipoCaracteristica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artefacto" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Artefacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaracteristicasHogar" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "ambitoId" INTEGER NOT NULL,
    "tipoViviendaId" INTEGER NOT NULL,
    "tipoCaracteristicaId" INTEGER NOT NULL,
    "artefactoId" INTEGER NOT NULL,

    CONSTRAINT "CaracteristicasHogar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NivelEducativo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "NivelEducativo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducacionNivel" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "ambitoId" INTEGER NOT NULL,
    "edadIntervaloId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,
    "nivelEducativoId" INTEGER NOT NULL,

    CONSTRAINT "EducacionNivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConocimientoIdioma" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "ConocimientoIdioma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducacionIdioma" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "ambitoId" INTEGER NOT NULL,
    "edadIntervaloId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,
    "conocimientoIdiomaId" INTEGER NOT NULL,

    CONSTRAINT "EducacionIdioma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NivelAlfabetismo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "NivelAlfabetismo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducacionAlfabetismo" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "ambitoId" INTEGER NOT NULL,
    "edadIntervaloId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,
    "nivelAlfabetismoId" INTEGER NOT NULL,

    CONSTRAINT "EducacionAlfabetismo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RangoAnio" (
    "id" SERIAL NOT NULL,
    "rango" VARCHAR(100) NOT NULL,

    CONSTRAINT "RangoAnio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducacionDesercion" (
    "id" SERIAL NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "rangoId" INTEGER NOT NULL,
    "rangoAnioId" INTEGER,

    CONSTRAINT "EducacionDesercion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ugel" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Ugel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nivel" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoInstitucion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "TipoInstitucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstadoEvaluacion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "EstadoEvaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModalidadEducativa" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "ModalidadEducativa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grado" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Grado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CentroPoblado" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "ubicacionId" INTEGER NOT NULL,

    CONSTRAINT "CentroPoblado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducacionConclusion" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "centroPobladoId" INTEGER NOT NULL,
    "edadIntervaloId" INTEGER NOT NULL,
    "ugelId" INTEGER NOT NULL,
    "nivelEducativoId" INTEGER NOT NULL,
    "tipoInstitucionId" INTEGER NOT NULL,
    "estadoEvaluacionId" INTEGER NOT NULL,
    "modalidadEducativaId" INTEGER NOT NULL,
    "gradoId" INTEGER,
    "nivelId" INTEGER,

    CONSTRAINT "EducacionConclusion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducacionMatriculas" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "orden" INTEGER,
    "ubicacionId" INTEGER NOT NULL,
    "centroPobladoId" INTEGER NOT NULL,
    "edadIntervaloId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,
    "ugelId" INTEGER NOT NULL,
    "gradoId" INTEGER,
    "nivelEducativoId" INTEGER NOT NULL,
    "tipoInstitucionId" INTEGER NOT NULL,
    "modalidadEducativaId" INTEGER NOT NULL,

    CONSTRAINT "EducacionMatriculas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesarrolloEconomico" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "indicadorIntermedio" DOUBLE PRECISION NOT NULL,
    "indicadorSuperior" DOUBLE PRECISION NOT NULL,
    "departamentoId" INTEGER NOT NULL,

    CONSTRAINT "DesarrolloEconomico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoCobertura" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "TipoCobertura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiciosBasicos" (
    "id" SERIAL NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "centroPobladoId" INTEGER NOT NULL,
    "tipoCoberturaId" INTEGER NOT NULL,
    "mesId" INTEGER,

    CONSTRAINT "ServiciosBasicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedSalud" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "RedSalud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstablecimientoSalud" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "EstablecimientoSalud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndicadorSalud" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,

    CONSTRAINT "IndicadorSalud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaludPrenatal" (
    "id" SERIAL NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "poblacion" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "numeroCasos" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "redSaludId" INTEGER NOT NULL,
    "establecimientoId" INTEGER NOT NULL,
    "indicadorSaludId" INTEGER NOT NULL,
    "mesId" INTEGER,

    CONSTRAINT "SaludPrenatal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoDesnutricion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "TipoDesnutricion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndicadorNutricion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,

    CONSTRAINT "IndicadorNutricion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NinosNutricion" (
    "id" SERIAL NOT NULL,
    "numeroCasos" INTEGER NOT NULL,
    "evaluados" INTEGER NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "tipoDesnutricionId" INTEGER NOT NULL,
    "indicadorNutricionId" INTEGER NOT NULL,

    CONSTRAINT "NinosNutricion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoAnemia" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "TipoAnemia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndicadorAnemia" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,

    CONSTRAINT "IndicadorAnemia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NinosAnemia" (
    "id" SERIAL NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "numeroCasos" INTEGER NOT NULL,
    "evaluados" INTEGER NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "NinosAnemia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ninos" (
    "id" SERIAL NOT NULL,
    "poblacion" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "numeroCasos" INTEGER NOT NULL,
    "nombreMes" VARCHAR(100),
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "brecha" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "redSaludId" INTEGER NOT NULL,
    "establecimientoId" INTEGER NOT NULL,
    "indicadorSaludId" INTEGER NOT NULL,
    "mesId" INTEGER,

    CONSTRAINT "Ninos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mes" (
    "id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "Mes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jovenes" (
    "id" SERIAL NOT NULL,
    "poblacion" INTEGER NOT NULL,
    "numeroCasos" INTEGER NOT NULL,
    "cobertura" DOUBLE PRECISION NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "redSaludId" INTEGER NOT NULL,
    "establecimientoId" INTEGER NOT NULL,
    "indicadorSaludId" INTEGER NOT NULL,
    "mesId" INTEGER NOT NULL,

    CONSTRAINT "Jovenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndicadorAnemiaGestantes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,

    CONSTRAINT "IndicadorAnemiaGestantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GestantesAnemia" (
    "id" SERIAL NOT NULL,
    "numeroCasos" INTEGER NOT NULL,
    "evaluados" INTEGER NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "brecha" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "tipoAnemiaId" INTEGER NOT NULL,
    "indicadorAnemiaGestantesId" INTEGER NOT NULL,

    CONSTRAINT "GestantesAnemia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdultoMayor" (
    "id" SERIAL NOT NULL,
    "poblacion" INTEGER NOT NULL,
    "numeroCasos" INTEGER NOT NULL,
    "cobertura" DOUBLE PRECISION NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "redSaludId" INTEGER NOT NULL,
    "establecimientoId" INTEGER NOT NULL,
    "indicadorSaludId" INTEGER NOT NULL,
    "mesId" INTEGER NOT NULL,

    CONSTRAINT "AdultoMayor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adulto" (
    "id" SERIAL NOT NULL,
    "poblacion" INTEGER NOT NULL,
    "numeroCasos" INTEGER NOT NULL,
    "cobertura" DOUBLE PRECISION NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "redSaludId" INTEGER NOT NULL,
    "establecimientoId" INTEGER NOT NULL,
    "indicadorSaludId" INTEGER NOT NULL,
    "mesId" INTEGER NOT NULL,

    CONSTRAINT "Adulto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adolescentes" (
    "id" SERIAL NOT NULL,
    "poblacion" INTEGER NOT NULL,
    "numeroCasos" INTEGER NOT NULL,
    "cobertura" DOUBLE PRECISION NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "redSaludId" INTEGER NOT NULL,
    "establecimientoId" INTEGER NOT NULL,
    "indicadorSaludId" INTEGER NOT NULL,
    "mesId" INTEGER NOT NULL,

    CONSTRAINT "Adolescentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCorte" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "SubCorte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoCar" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,

    CONSTRAINT "TipoCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CentrosAcogida" (
    "id" SERIAL NOT NULL,
    "car" VARCHAR(100) NOT NULL,
    "anio" INTEGER NOT NULL,
    "nSubCorte" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "mesId" INTEGER NOT NULL,
    "subCorteId" INTEGER NOT NULL,
    "tipoCarId" INTEGER NOT NULL,

    CONSTRAINT "CentrosAcogida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edad" (
    "id" SERIAL NOT NULL,
    "rangoEdad" VARCHAR(100) NOT NULL,
    "generoId" INTEGER,

    CONSTRAINT "Edad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discapacidad" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Discapacidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trimestre" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Trimestre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reniec" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "edadId" INTEGER NOT NULL,
    "discapacidadId" INTEGER NOT NULL,
    "trimestreId" INTEGER NOT NULL,

    CONSTRAINT "Reniec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonasDiscapacidad" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "mesId" INTEGER,

    CONSTRAINT "PersonasDiscapacidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricasDiscapacidad" (
    "id" SERIAL NOT NULL,
    "personasDiscapacidadId" INTEGER NOT NULL,
    "numeroCasos" INTEGER NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "brecha" INTEGER NOT NULL,

    CONSTRAINT "MetricasDiscapacidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallesDiscapacidad" (
    "id" SERIAL NOT NULL,
    "personasDiscapacidadId" INTEGER NOT NULL,
    "edadId" INTEGER,
    "discapacidadId" INTEGER,
    "trimestreId" INTEGER,

    CONSTRAINT "DetallesDiscapacidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstadoCivil" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "EstadoCivil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoViolencia" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "TipoViolencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoPeriodo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "TipoPeriodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Periodo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipoPeriodoId" INTEGER NOT NULL,

    CONSTRAINT "Periodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViolenciaFemenino" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "ubicacionId" INTEGER,
    "edadId" INTEGER,
    "estadoCivilId" INTEGER,
    "tipoViolenciaId" INTEGER,
    "periodoId" INTEGER NOT NULL,

    CONSTRAINT "ViolenciaFemenino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_code_key" ON "PasswordResetToken"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_nombre_key" ON "Departamento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Provincia_nombre_key" ON "Provincia"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Provincia_nombre_departamentoId_key" ON "Provincia"("nombre", "departamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "Distrito_ubigeoDistrital_key" ON "Distrito"("ubigeoDistrital");

-- CreateIndex
CREATE UNIQUE INDEX "Distrito_nombre_provinciaId_key" ON "Distrito"("nombre", "provinciaId");

-- CreateIndex
CREATE UNIQUE INDEX "Ubicacion_departamentoId_provinciaId_distritoId_key" ON "Ubicacion"("departamentoId", "provinciaId", "distritoId");

-- CreateIndex
CREATE UNIQUE INDEX "Ambito_nombre_key" ON "Ambito"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Genero_nombre_key" ON "Genero"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "EdadIntervalo_intervalo_key" ON "EdadIntervalo"("intervalo");

-- CreateIndex
CREATE INDEX "Poblacion_anio_idx" ON "Poblacion"("anio");

-- CreateIndex
CREATE UNIQUE INDEX "Avance_objetive_distritoId_operation_key" ON "Avance"("objetive", "distritoId", "operation");

-- CreateIndex
CREATE INDEX "Vivienda_anio_idx" ON "Vivienda"("anio");

-- CreateIndex
CREATE INDEX "DificultadFisica_anio_idx" ON "DificultadFisica"("anio");

-- CreateIndex
CREATE INDEX "AfiliacionSalud_anio_idx" ON "AfiliacionSalud"("anio");

-- CreateIndex
CREATE INDEX "CaracteristicasHogar_anio_idx" ON "CaracteristicasHogar"("anio");

-- CreateIndex
CREATE INDEX "EducacionNivel_anio_idx" ON "EducacionNivel"("anio");

-- CreateIndex
CREATE INDEX "EducacionIdioma_anio_idx" ON "EducacionIdioma"("anio");

-- CreateIndex
CREATE INDEX "EducacionAlfabetismo_anio_idx" ON "EducacionAlfabetismo"("anio");

-- CreateIndex
CREATE INDEX "CentroPoblado_ubicacionId_idx" ON "CentroPoblado"("ubicacionId");

-- CreateIndex
CREATE INDEX "EducacionConclusion_anio_idx" ON "EducacionConclusion"("anio");

-- CreateIndex
CREATE INDEX "EducacionMatriculas_anio_ubicacionId_idx" ON "EducacionMatriculas"("anio", "ubicacionId");

-- CreateIndex
CREATE INDEX "DesarrolloEconomico_anio_idx" ON "DesarrolloEconomico"("anio");

-- CreateIndex
CREATE INDEX "ServiciosBasicos_anio_ubicacionId_idx" ON "ServiciosBasicos"("anio", "ubicacionId");

-- CreateIndex
CREATE INDEX "ServiciosBasicos_mes_idx" ON "ServiciosBasicos"("mes");

-- CreateIndex
CREATE INDEX "ServiciosBasicos_mesId_idx" ON "ServiciosBasicos"("mesId");

-- CreateIndex
CREATE INDEX "SaludPrenatal_anio_idx" ON "SaludPrenatal"("anio");

-- CreateIndex
CREATE INDEX "SaludPrenatal_mes_idx" ON "SaludPrenatal"("mes");

-- CreateIndex
CREATE INDEX "SaludPrenatal_mesId_idx" ON "SaludPrenatal"("mesId");

-- CreateIndex
CREATE INDEX "NinosNutricion_anio_idx" ON "NinosNutricion"("anio");

-- CreateIndex
CREATE INDEX "NinosAnemia_anio_idx" ON "NinosAnemia"("anio");

-- CreateIndex
CREATE INDEX "Ninos_anio_idx" ON "Ninos"("anio");

-- CreateIndex
CREATE INDEX "Ninos_mes_idx" ON "Ninos"("mes");

-- CreateIndex
CREATE UNIQUE INDEX "Mes_orden_key" ON "Mes"("orden");

-- CreateIndex
CREATE INDEX "Mes_orden_idx" ON "Mes"("orden");

-- CreateIndex
CREATE INDEX "Jovenes_anio_idx" ON "Jovenes"("anio");

-- CreateIndex
CREATE INDEX "Jovenes_mesId_idx" ON "Jovenes"("mesId");

-- CreateIndex
CREATE INDEX "GestantesAnemia_anio_idx" ON "GestantesAnemia"("anio");

-- CreateIndex
CREATE INDEX "AdultoMayor_anio_idx" ON "AdultoMayor"("anio");

-- CreateIndex
CREATE INDEX "AdultoMayor_mesId_idx" ON "AdultoMayor"("mesId");

-- CreateIndex
CREATE INDEX "Adulto_anio_idx" ON "Adulto"("anio");

-- CreateIndex
CREATE INDEX "Adulto_mesId_idx" ON "Adulto"("mesId");

-- CreateIndex
CREATE INDEX "Adolescentes_anio_idx" ON "Adolescentes"("anio");

-- CreateIndex
CREATE INDEX "Adolescentes_mesId_idx" ON "Adolescentes"("mesId");

-- CreateIndex
CREATE INDEX "CentrosAcogida_anio_idx" ON "CentrosAcogida"("anio");

-- CreateIndex
CREATE INDEX "CentrosAcogida_mesId_idx" ON "CentrosAcogida"("mesId");

-- CreateIndex
CREATE INDEX "Reniec_anio_idx" ON "Reniec"("anio");

-- CreateIndex
CREATE INDEX "PersonasDiscapacidad_anio_idx" ON "PersonasDiscapacidad"("anio");

-- CreateIndex
CREATE INDEX "PersonasDiscapacidad_mesId_idx" ON "PersonasDiscapacidad"("mesId");

-- CreateIndex
CREATE INDEX "MetricasDiscapacidad_personasDiscapacidadId_idx" ON "MetricasDiscapacidad"("personasDiscapacidadId");

-- CreateIndex
CREATE INDEX "DetallesDiscapacidad_personasDiscapacidadId_idx" ON "DetallesDiscapacidad"("personasDiscapacidadId");

-- CreateIndex
CREATE INDEX "ViolenciaFemenino_anio_idx" ON "ViolenciaFemenino"("anio");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distrito" ADD CONSTRAINT "Distrito_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_distritoId_fkey" FOREIGN KEY ("distritoId") REFERENCES "Distrito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poblacion" ADD CONSTRAINT "Poblacion_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poblacion" ADD CONSTRAINT "Poblacion_ambitoId_fkey" FOREIGN KEY ("ambitoId") REFERENCES "Ambito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poblacion" ADD CONSTRAINT "Poblacion_edadIntervaloId_fkey" FOREIGN KEY ("edadIntervaloId") REFERENCES "EdadIntervalo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poblacion" ADD CONSTRAINT "Poblacion_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avance" ADD CONSTRAINT "Avance_distritoId_fkey" FOREIGN KEY ("distritoId") REFERENCES "Distrito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vivienda" ADD CONSTRAINT "Vivienda_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vivienda" ADD CONSTRAINT "Vivienda_ambitoId_fkey" FOREIGN KEY ("ambitoId") REFERENCES "Ambito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vivienda" ADD CONSTRAINT "Vivienda_tipoViviendaId_fkey" FOREIGN KEY ("tipoViviendaId") REFERENCES "TipoVivienda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DificultadFisica" ADD CONSTRAINT "DificultadFisica_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DificultadFisica" ADD CONSTRAINT "DificultadFisica_ambitoId_fkey" FOREIGN KEY ("ambitoId") REFERENCES "Ambito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DificultadFisica" ADD CONSTRAINT "DificultadFisica_edadIntervaloId_fkey" FOREIGN KEY ("edadIntervaloId") REFERENCES "EdadIntervalo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DificultadFisica" ADD CONSTRAINT "DificultadFisica_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AfiliacionSalud" ADD CONSTRAINT "AfiliacionSalud_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AfiliacionSalud" ADD CONSTRAINT "AfiliacionSalud_ambitoId_fkey" FOREIGN KEY ("ambitoId") REFERENCES "Ambito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AfiliacionSalud" ADD CONSTRAINT "AfiliacionSalud_edadIntervaloId_fkey" FOREIGN KEY ("edadIntervaloId") REFERENCES "EdadIntervalo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AfiliacionSalud" ADD CONSTRAINT "AfiliacionSalud_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AfiliacionSalud" ADD CONSTRAINT "AfiliacionSalud_tipoAfiliacionId_fkey" FOREIGN KEY ("tipoAfiliacionId") REFERENCES "TipoAfiliacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaracteristicasHogar" ADD CONSTRAINT "CaracteristicasHogar_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaracteristicasHogar" ADD CONSTRAINT "CaracteristicasHogar_ambitoId_fkey" FOREIGN KEY ("ambitoId") REFERENCES "Ambito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaracteristicasHogar" ADD CONSTRAINT "CaracteristicasHogar_tipoViviendaId_fkey" FOREIGN KEY ("tipoViviendaId") REFERENCES "TipoVivienda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaracteristicasHogar" ADD CONSTRAINT "CaracteristicasHogar_tipoCaracteristicaId_fkey" FOREIGN KEY ("tipoCaracteristicaId") REFERENCES "TipoCaracteristica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaracteristicasHogar" ADD CONSTRAINT "CaracteristicasHogar_artefactoId_fkey" FOREIGN KEY ("artefactoId") REFERENCES "Artefacto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionNivel" ADD CONSTRAINT "EducacionNivel_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionNivel" ADD CONSTRAINT "EducacionNivel_ambitoId_fkey" FOREIGN KEY ("ambitoId") REFERENCES "Ambito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionNivel" ADD CONSTRAINT "EducacionNivel_edadIntervaloId_fkey" FOREIGN KEY ("edadIntervaloId") REFERENCES "EdadIntervalo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionNivel" ADD CONSTRAINT "EducacionNivel_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionNivel" ADD CONSTRAINT "EducacionNivel_nivelEducativoId_fkey" FOREIGN KEY ("nivelEducativoId") REFERENCES "NivelEducativo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionIdioma" ADD CONSTRAINT "EducacionIdioma_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionIdioma" ADD CONSTRAINT "EducacionIdioma_ambitoId_fkey" FOREIGN KEY ("ambitoId") REFERENCES "Ambito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionIdioma" ADD CONSTRAINT "EducacionIdioma_edadIntervaloId_fkey" FOREIGN KEY ("edadIntervaloId") REFERENCES "EdadIntervalo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionIdioma" ADD CONSTRAINT "EducacionIdioma_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionIdioma" ADD CONSTRAINT "EducacionIdioma_conocimientoIdiomaId_fkey" FOREIGN KEY ("conocimientoIdiomaId") REFERENCES "ConocimientoIdioma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionAlfabetismo" ADD CONSTRAINT "EducacionAlfabetismo_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionAlfabetismo" ADD CONSTRAINT "EducacionAlfabetismo_ambitoId_fkey" FOREIGN KEY ("ambitoId") REFERENCES "Ambito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionAlfabetismo" ADD CONSTRAINT "EducacionAlfabetismo_edadIntervaloId_fkey" FOREIGN KEY ("edadIntervaloId") REFERENCES "EdadIntervalo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionAlfabetismo" ADD CONSTRAINT "EducacionAlfabetismo_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionAlfabetismo" ADD CONSTRAINT "EducacionAlfabetismo_nivelAlfabetismoId_fkey" FOREIGN KEY ("nivelAlfabetismoId") REFERENCES "NivelAlfabetismo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionDesercion" ADD CONSTRAINT "EducacionDesercion_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionDesercion" ADD CONSTRAINT "EducacionDesercion_rangoAnioId_fkey" FOREIGN KEY ("rangoAnioId") REFERENCES "RangoAnio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CentroPoblado" ADD CONSTRAINT "CentroPoblado_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionConclusion" ADD CONSTRAINT "EducacionConclusion_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionConclusion" ADD CONSTRAINT "EducacionConclusion_centroPobladoId_fkey" FOREIGN KEY ("centroPobladoId") REFERENCES "CentroPoblado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionConclusion" ADD CONSTRAINT "EducacionConclusion_edadIntervaloId_fkey" FOREIGN KEY ("edadIntervaloId") REFERENCES "EdadIntervalo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionConclusion" ADD CONSTRAINT "EducacionConclusion_ugelId_fkey" FOREIGN KEY ("ugelId") REFERENCES "Ugel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionConclusion" ADD CONSTRAINT "EducacionConclusion_nivelEducativoId_fkey" FOREIGN KEY ("nivelEducativoId") REFERENCES "NivelEducativo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionConclusion" ADD CONSTRAINT "EducacionConclusion_tipoInstitucionId_fkey" FOREIGN KEY ("tipoInstitucionId") REFERENCES "TipoInstitucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionConclusion" ADD CONSTRAINT "EducacionConclusion_estadoEvaluacionId_fkey" FOREIGN KEY ("estadoEvaluacionId") REFERENCES "EstadoEvaluacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionConclusion" ADD CONSTRAINT "EducacionConclusion_modalidadEducativaId_fkey" FOREIGN KEY ("modalidadEducativaId") REFERENCES "ModalidadEducativa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionConclusion" ADD CONSTRAINT "EducacionConclusion_gradoId_fkey" FOREIGN KEY ("gradoId") REFERENCES "Grado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionConclusion" ADD CONSTRAINT "EducacionConclusion_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionMatriculas" ADD CONSTRAINT "EducacionMatriculas_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionMatriculas" ADD CONSTRAINT "EducacionMatriculas_centroPobladoId_fkey" FOREIGN KEY ("centroPobladoId") REFERENCES "CentroPoblado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionMatriculas" ADD CONSTRAINT "EducacionMatriculas_edadIntervaloId_fkey" FOREIGN KEY ("edadIntervaloId") REFERENCES "EdadIntervalo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionMatriculas" ADD CONSTRAINT "EducacionMatriculas_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionMatriculas" ADD CONSTRAINT "EducacionMatriculas_ugelId_fkey" FOREIGN KEY ("ugelId") REFERENCES "Ugel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionMatriculas" ADD CONSTRAINT "EducacionMatriculas_gradoId_fkey" FOREIGN KEY ("gradoId") REFERENCES "Grado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionMatriculas" ADD CONSTRAINT "EducacionMatriculas_nivelEducativoId_fkey" FOREIGN KEY ("nivelEducativoId") REFERENCES "NivelEducativo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionMatriculas" ADD CONSTRAINT "EducacionMatriculas_tipoInstitucionId_fkey" FOREIGN KEY ("tipoInstitucionId") REFERENCES "TipoInstitucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducacionMatriculas" ADD CONSTRAINT "EducacionMatriculas_modalidadEducativaId_fkey" FOREIGN KEY ("modalidadEducativaId") REFERENCES "ModalidadEducativa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesarrolloEconomico" ADD CONSTRAINT "DesarrolloEconomico_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiciosBasicos" ADD CONSTRAINT "ServiciosBasicos_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiciosBasicos" ADD CONSTRAINT "ServiciosBasicos_centroPobladoId_fkey" FOREIGN KEY ("centroPobladoId") REFERENCES "CentroPoblado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiciosBasicos" ADD CONSTRAINT "ServiciosBasicos_tipoCoberturaId_fkey" FOREIGN KEY ("tipoCoberturaId") REFERENCES "TipoCobertura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiciosBasicos" ADD CONSTRAINT "ServiciosBasicos_mesId_fkey" FOREIGN KEY ("mesId") REFERENCES "Mes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaludPrenatal" ADD CONSTRAINT "SaludPrenatal_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaludPrenatal" ADD CONSTRAINT "SaludPrenatal_redSaludId_fkey" FOREIGN KEY ("redSaludId") REFERENCES "RedSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaludPrenatal" ADD CONSTRAINT "SaludPrenatal_establecimientoId_fkey" FOREIGN KEY ("establecimientoId") REFERENCES "EstablecimientoSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaludPrenatal" ADD CONSTRAINT "SaludPrenatal_indicadorSaludId_fkey" FOREIGN KEY ("indicadorSaludId") REFERENCES "IndicadorSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaludPrenatal" ADD CONSTRAINT "SaludPrenatal_mesId_fkey" FOREIGN KEY ("mesId") REFERENCES "Mes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NinosNutricion" ADD CONSTRAINT "NinosNutricion_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NinosNutricion" ADD CONSTRAINT "NinosNutricion_tipoDesnutricionId_fkey" FOREIGN KEY ("tipoDesnutricionId") REFERENCES "TipoDesnutricion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NinosNutricion" ADD CONSTRAINT "NinosNutricion_indicadorNutricionId_fkey" FOREIGN KEY ("indicadorNutricionId") REFERENCES "IndicadorNutricion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NinosAnemia" ADD CONSTRAINT "NinosAnemia_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ninos" ADD CONSTRAINT "Ninos_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ninos" ADD CONSTRAINT "Ninos_redSaludId_fkey" FOREIGN KEY ("redSaludId") REFERENCES "RedSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ninos" ADD CONSTRAINT "Ninos_establecimientoId_fkey" FOREIGN KEY ("establecimientoId") REFERENCES "EstablecimientoSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ninos" ADD CONSTRAINT "Ninos_indicadorSaludId_fkey" FOREIGN KEY ("indicadorSaludId") REFERENCES "IndicadorSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ninos" ADD CONSTRAINT "Ninos_mesId_fkey" FOREIGN KEY ("mesId") REFERENCES "Mes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jovenes" ADD CONSTRAINT "Jovenes_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jovenes" ADD CONSTRAINT "Jovenes_redSaludId_fkey" FOREIGN KEY ("redSaludId") REFERENCES "RedSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jovenes" ADD CONSTRAINT "Jovenes_establecimientoId_fkey" FOREIGN KEY ("establecimientoId") REFERENCES "EstablecimientoSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jovenes" ADD CONSTRAINT "Jovenes_indicadorSaludId_fkey" FOREIGN KEY ("indicadorSaludId") REFERENCES "IndicadorSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jovenes" ADD CONSTRAINT "Jovenes_mesId_fkey" FOREIGN KEY ("mesId") REFERENCES "Mes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GestantesAnemia" ADD CONSTRAINT "GestantesAnemia_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GestantesAnemia" ADD CONSTRAINT "GestantesAnemia_tipoAnemiaId_fkey" FOREIGN KEY ("tipoAnemiaId") REFERENCES "TipoAnemia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GestantesAnemia" ADD CONSTRAINT "GestantesAnemia_indicadorAnemiaGestantesId_fkey" FOREIGN KEY ("indicadorAnemiaGestantesId") REFERENCES "IndicadorAnemiaGestantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdultoMayor" ADD CONSTRAINT "AdultoMayor_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdultoMayor" ADD CONSTRAINT "AdultoMayor_redSaludId_fkey" FOREIGN KEY ("redSaludId") REFERENCES "RedSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdultoMayor" ADD CONSTRAINT "AdultoMayor_establecimientoId_fkey" FOREIGN KEY ("establecimientoId") REFERENCES "EstablecimientoSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdultoMayor" ADD CONSTRAINT "AdultoMayor_indicadorSaludId_fkey" FOREIGN KEY ("indicadorSaludId") REFERENCES "IndicadorSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdultoMayor" ADD CONSTRAINT "AdultoMayor_mesId_fkey" FOREIGN KEY ("mesId") REFERENCES "Mes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adulto" ADD CONSTRAINT "Adulto_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adulto" ADD CONSTRAINT "Adulto_redSaludId_fkey" FOREIGN KEY ("redSaludId") REFERENCES "RedSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adulto" ADD CONSTRAINT "Adulto_establecimientoId_fkey" FOREIGN KEY ("establecimientoId") REFERENCES "EstablecimientoSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adulto" ADD CONSTRAINT "Adulto_indicadorSaludId_fkey" FOREIGN KEY ("indicadorSaludId") REFERENCES "IndicadorSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adulto" ADD CONSTRAINT "Adulto_mesId_fkey" FOREIGN KEY ("mesId") REFERENCES "Mes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adolescentes" ADD CONSTRAINT "Adolescentes_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adolescentes" ADD CONSTRAINT "Adolescentes_redSaludId_fkey" FOREIGN KEY ("redSaludId") REFERENCES "RedSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adolescentes" ADD CONSTRAINT "Adolescentes_establecimientoId_fkey" FOREIGN KEY ("establecimientoId") REFERENCES "EstablecimientoSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adolescentes" ADD CONSTRAINT "Adolescentes_indicadorSaludId_fkey" FOREIGN KEY ("indicadorSaludId") REFERENCES "IndicadorSalud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adolescentes" ADD CONSTRAINT "Adolescentes_mesId_fkey" FOREIGN KEY ("mesId") REFERENCES "Mes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CentrosAcogida" ADD CONSTRAINT "CentrosAcogida_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CentrosAcogida" ADD CONSTRAINT "CentrosAcogida_mesId_fkey" FOREIGN KEY ("mesId") REFERENCES "Mes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CentrosAcogida" ADD CONSTRAINT "CentrosAcogida_subCorteId_fkey" FOREIGN KEY ("subCorteId") REFERENCES "SubCorte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CentrosAcogida" ADD CONSTRAINT "CentrosAcogida_tipoCarId_fkey" FOREIGN KEY ("tipoCarId") REFERENCES "TipoCar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edad" ADD CONSTRAINT "Edad_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reniec" ADD CONSTRAINT "Reniec_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reniec" ADD CONSTRAINT "Reniec_edadId_fkey" FOREIGN KEY ("edadId") REFERENCES "Edad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reniec" ADD CONSTRAINT "Reniec_discapacidadId_fkey" FOREIGN KEY ("discapacidadId") REFERENCES "Discapacidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reniec" ADD CONSTRAINT "Reniec_trimestreId_fkey" FOREIGN KEY ("trimestreId") REFERENCES "Trimestre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonasDiscapacidad" ADD CONSTRAINT "PersonasDiscapacidad_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonasDiscapacidad" ADD CONSTRAINT "PersonasDiscapacidad_mesId_fkey" FOREIGN KEY ("mesId") REFERENCES "Mes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricasDiscapacidad" ADD CONSTRAINT "MetricasDiscapacidad_personasDiscapacidadId_fkey" FOREIGN KEY ("personasDiscapacidadId") REFERENCES "PersonasDiscapacidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesDiscapacidad" ADD CONSTRAINT "DetallesDiscapacidad_personasDiscapacidadId_fkey" FOREIGN KEY ("personasDiscapacidadId") REFERENCES "PersonasDiscapacidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesDiscapacidad" ADD CONSTRAINT "DetallesDiscapacidad_edadId_fkey" FOREIGN KEY ("edadId") REFERENCES "Edad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesDiscapacidad" ADD CONSTRAINT "DetallesDiscapacidad_discapacidadId_fkey" FOREIGN KEY ("discapacidadId") REFERENCES "Discapacidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesDiscapacidad" ADD CONSTRAINT "DetallesDiscapacidad_trimestreId_fkey" FOREIGN KEY ("trimestreId") REFERENCES "Trimestre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periodo" ADD CONSTRAINT "Periodo_tipoPeriodoId_fkey" FOREIGN KEY ("tipoPeriodoId") REFERENCES "TipoPeriodo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViolenciaFemenino" ADD CONSTRAINT "ViolenciaFemenino_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViolenciaFemenino" ADD CONSTRAINT "ViolenciaFemenino_edadId_fkey" FOREIGN KEY ("edadId") REFERENCES "Edad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViolenciaFemenino" ADD CONSTRAINT "ViolenciaFemenino_estadoCivilId_fkey" FOREIGN KEY ("estadoCivilId") REFERENCES "EstadoCivil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViolenciaFemenino" ADD CONSTRAINT "ViolenciaFemenino_tipoViolenciaId_fkey" FOREIGN KEY ("tipoViolenciaId") REFERENCES "TipoViolencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViolenciaFemenino" ADD CONSTRAINT "ViolenciaFemenino_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
