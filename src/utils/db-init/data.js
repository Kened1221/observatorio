const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // 1. Crear el Departamento (Ayacucho)
    const departamento = await prisma.departamento.upsert({
      where: { nombre: "AYACUCHO" },
      update: {},
      create: {
        nombre: "AYACUCHO",
      },
    });
    console.log("Departamento creado con ID:", departamento.id);

    // 2. Crear Provincias
    const provinciasData = [
      { nombre: "CANGALLO", departamentoId: departamento.id },
      { nombre: "HUAMANGA", departamentoId: departamento.id },
      { nombre: "HUANCA SANCOS", departamentoId: departamento.id },
      { nombre: "HUANTA", departamentoId: departamento.id },
      { nombre: "LA MAR", departamentoId: departamento.id },
      { nombre: "LUCANAS", departamentoId: departamento.id },
      { nombre: "PARINACOCHAS", departamentoId: departamento.id },
      { nombre: "PAUCAR DEL SARA SARA", departamentoId: departamento.id },
      { nombre: "SUCRE", departamentoId: departamento.id },
      { nombre: "VICTOR FAJARDO", departamentoId: departamento.id },
      { nombre: "VILCAS HUAMAN", departamentoId: departamento.id },
    ];

    const provincias = [];
    for (const prov of provinciasData) {
      const provincia = await prisma.provincia.upsert({
        where: {
          nombre_departamentoId: {
            nombre: prov.nombre,
            departamentoId: prov.departamentoId,
          },
        },
        update: { departamentoId: prov.departamentoId },
        create: {
          nombre: prov.nombre,
          departamentoId: prov.departamentoId,
        },
      });
      provincias.push(provincia);
    }
    console.log("Provincias creadas:", provincias.length);

    // 3. Crear Distritos
    const distritosData = [
      // Cangallo (provinciaId = 1)
      { nombre: "CANGALLO", provinciaId: provincias[0].id },
      { nombre: "CHUSCHI", provinciaId: provincias[0].id },
      { nombre: "LOS MOROCHUCOS", provinciaId: provincias[0].id },
      { nombre: "MARIA PARADO DE BELLIDO", provinciaId: provincias[0].id },
      { nombre: "PARAS", provinciaId: provincias[0].id },
      { nombre: "TOTOS", provinciaId: provincias[0].id },
      // Huamanga (provinciaId = 2)
      { nombre: "ACOCRO", provinciaId: provincias[1].id },
      { nombre: "ACOS VINCHOS", provinciaId: provincias[1].id },
      { nombre: "ANDRES AVELINO CACERES DORREGARAY", provinciaId: provincias[1].id },
      { nombre: "AYACUCHO", provinciaId: provincias[1].id },
      { nombre: "CARMEN ALTO", provinciaId: provincias[1].id },
      { nombre: "CHIARA", provinciaId: provincias[1].id },
      { nombre: "JESUS NAZARENO", provinciaId: provincias[1].id },
      { nombre: "OCROS", provinciaId: provincias[1].id },
      { nombre: "PACAYCASA", provinciaId: provincias[1].id },
      { nombre: "QUINUA", provinciaId: provincias[1].id },
      { nombre: "SAN JOSE DE TICLLAS", provinciaId: provincias[1].id },
      { nombre: "SAN JUAN BAUTISTA", provinciaId: provincias[1].id },
      { nombre: "SANTIAGO DE PISCHA", provinciaId: provincias[1].id },
      { nombre: "SOCOS", provinciaId: provincias[1].id },
      { nombre: "TAMBILLO", provinciaId: provincias[1].id },
      { nombre: "VINCHOS", provinciaId: provincias[1].id },
      // Huanca Sancos (provinciaId = 3)
      { nombre: "CARAPO", provinciaId: provincias[2].id },
      { nombre: "SACSAMARCA", provinciaId: provincias[2].id },
      { nombre: "HUANCA SANCOS", provinciaId: provincias[2].id },
      { nombre: "SANTIAGO DE LUCANAMARCA", provinciaId: provincias[2].id },
      // Huanta (provinciaId = 4)
      { nombre: "AYAHUANCO", provinciaId: provincias[3].id },
      { nombre: "CANAYRE", provinciaId: provincias[3].id },
      { nombre: "CHACA", provinciaId: provincias[3].id },
      { nombre: "HUAMANGUILLA", provinciaId: provincias[3].id },
      { nombre: "HUANTA", provinciaId: provincias[3].id },
      { nombre: "IGUAIN", provinciaId: provincias[3].id },
      { nombre: "LLOCHEGUA", provinciaId: provincias[3].id },
      { nombre: "LURICOCHA", provinciaId: provincias[3].id },
      { nombre: "PUCACOLPA", provinciaId: provincias[3].id },
      { nombre: "PUTIS", provinciaId: provincias[3].id },
      { nombre: "SANTILLANA", provinciaId: provincias[3].id },
      { nombre: "SIVIA", provinciaId: provincias[3].id },
      { nombre: "UCHURACCAY", provinciaId: provincias[3].id },
      // La Mar (provinciaId = 5)
      { nombre: "ANCHIHUAY", provinciaId: provincias[4].id },
      { nombre: "ANCO", provinciaId: provincias[4].id },
      { nombre: "AYNA", provinciaId: provincias[4].id },
      { nombre: "CHILCAS", provinciaId: provincias[4].id },
      { nombre: "CHUNGUI", provinciaId: provincias[4].id },
      { nombre: "LUIS CARRANZA", provinciaId: provincias[4].id },
      { nombre: "NINABAMBA", provinciaId: provincias[4].id },
      { nombre: "ORONCCOY", provinciaId: provincias[4].id },
      { nombre: "PATIBAMBA", provinciaId: provincias[4].id },
      { nombre: "RIO MAGDALENA", provinciaId: provincias[4].id },
      { nombre: "SAMUGARI", provinciaId: provincias[4].id },
      { nombre: "SAN MIGUEL", provinciaId: provincias[4].id },
      { nombre: "SANTA ROSA", provinciaId: provincias[4].id },
      { nombre: "TAMBO", provinciaId: provincias[4].id },
      { nombre: "UNION PROGRESO", provinciaId: provincias[4].id },
      // Lucanas (provinciaId = 6)
      { nombre: "AUCARA", provinciaId: provincias[5].id },
      { nombre: "CABANA", provinciaId: provincias[5].id },
      { nombre: "CARMEN SALCEDO", provinciaId: provincias[5].id },
      { nombre: "CHAVIÑA", provinciaId: provincias[5].id },
      { nombre: "CHIPAO", provinciaId: provincias[5].id },
      { nombre: "HUACHUAS", provinciaId: provincias[5].id },
      { nombre: "LARAMATE", provinciaId: provincias[5].id },
      { nombre: "LEONCIO PRADO", provinciaId: provincias[5].id },
      { nombre: "LLAUTA", provinciaId: provincias[5].id },
      { nombre: "LUCANAS", provinciaId: provincias[5].id },
      { nombre: "OCAÑA", provinciaId: provincias[5].id },
      { nombre: "OTOCA", provinciaId: provincias[5].id },
      { nombre: "SAISA", provinciaId: provincias[5].id },
      { nombre: "SAN CRISTOBAL", provinciaId: provincias[5].id },
      { nombre: "SAN JUAN", provinciaId: provincias[5].id },
      { nombre: "SAN PEDRO", provinciaId: provincias[5].id },
      { nombre: "SAN PEDRO DE PALCO", provinciaId: provincias[5].id },
      { nombre: "SANCOS", provinciaId: provincias[5].id },
      { nombre: "SANTA ANA DE HUAYCAHUACHO", provinciaId: provincias[5].id },
      { nombre: "SANTA LUCIA", provinciaId: provincias[5].id },
      { nombre: "PUQUIO", provinciaId: provincias[5].id },
      // Parinacochas (provinciaId = 7)
      { nombre: "CHUMPI", provinciaId: provincias[6].id },
      { nombre: "CORACORA", provinciaId: provincias[6].id },
      { nombre: "CORONEL CASTAÑEDA", provinciaId: provincias[6].id },
      { nombre: "PACAPAUSA", provinciaId: provincias[6].id },
      { nombre: "PULLO", provinciaId: provincias[6].id },
      { nombre: "PUYUSCA", provinciaId: provincias[6].id },
      { nombre: "SAN FRANCISCO DE RAVACAYCO", provinciaId: provincias[6].id },
      { nombre: "UPAHUACHO", provinciaId: provincias[6].id },
      // Paucar del Sara Sara (provinciaId = 8)
      { nombre: "COLTA", provinciaId: provincias[7].id },
      { nombre: "CORCULLA", provinciaId: provincias[7].id },
      { nombre: "LAMPA", provinciaId: provincias[7].id },
      { nombre: "MARCABAMBA", provinciaId: provincias[7].id },
      { nombre: "OYOLO", provinciaId: provincias[7].id },
      { nombre: "PARARCA", provinciaId: provincias[7].id },
      { nombre: "PAUSA", provinciaId: provincias[7].id },
      { nombre: "SAN JAVIER DE ALPABAMBA", provinciaId: provincias[7].id },
      { nombre: "SAN JOSE DE USHUA", provinciaId: provincias[7].id },
      { nombre: "SARA SARA", provinciaId: provincias[7].id },
      // Sucre (provinciaId = 9)
      { nombre: "BELEN", provinciaId: provincias[8].id },
      { nombre: "CHALCOS", provinciaId: provincias[8].id },
      { nombre: "CHILCAYOC", provinciaId: provincias[8].id },
      { nombre: "HUACAÑA", provinciaId: provincias[8].id },
      { nombre: "MORCOLLA", provinciaId: provincias[8].id },
      { nombre: "PAICO", provinciaId: provincias[8].id },
      { nombre: "QUEROBAMBA", provinciaId: provincias[8].id },
      { nombre: "SAN PEDRO DE LARCAY", provinciaId: provincias[8].id },
      { nombre: "SAN SALVADOR DE QUIJE", provinciaId: provincias[8].id },
      { nombre: "SANTIAGO DE PAUCARAY", provinciaId: provincias[8].id },
      { nombre: "SORAS", provinciaId: provincias[8].id },
      // Victor Fajardo (provinciaId = 10)
      { nombre: "ALCAMENCA", provinciaId: provincias[9].id },
      { nombre: "APONGO", provinciaId: provincias[9].id },
      { nombre: "ASQUIPATA", provinciaId: provincias[9].id },
      { nombre: "CANARIA", provinciaId: provincias[9].id },
      { nombre: "CAYARA", provinciaId: provincias[9].id },
      { nombre: "COLCA", provinciaId: provincias[9].id },
      { nombre: "HUAMANQUIQUIA", provinciaId: provincias[9].id },
      { nombre: "HUANCAPI", provinciaId: provincias[9].id },
      { nombre: "HUANCARAYLLA", provinciaId: provincias[9].id },
      { nombre: "HUAYA", provinciaId: provincias[9].id },
      { nombre: "SARHUA", provinciaId: provincias[9].id },
      { nombre: "VILCANCHOS", provinciaId: provincias[9].id },
      // Vilcas Huaman (provinciaId = 11)
      { nombre: "ACCOMARCA", provinciaId: provincias[10].id },
      { nombre: "CARHUANCA", provinciaId: provincias[10].id },
      { nombre: "CONCEPCION", provinciaId: provincias[10].id },
      { nombre: "HUAMBALPA", provinciaId: provincias[10].id },
      { nombre: "INDEPENDENCIA", provinciaId: provincias[10].id },
      { nombre: "SAURAMA", provinciaId: provincias[10].id },
      { nombre: "VILCAS HUAMAN", provinciaId: provincias[10].id },
      { nombre: "VISCHONGO", provinciaId: provincias[10].id },
    ];

    const distritos = [];
    for (const dist of distritosData) {
      const distrito = await prisma.distrito.upsert({
        where: {
          nombre_provinciaId: {
            nombre: dist.nombre,
            provinciaId: dist.provinciaId,
          },
        },
        update: { provinciaId: dist.provinciaId },
        create: {
          nombre: dist.nombre,
          provinciaId: dist.provinciaId,
        },
      });
      distritos.push(distrito);
    }
    console.log("Distritos creados:", distritos.length);

    // 4. Crear Géneros
    const generosData = [
      { nombre: "Masculino" },
      { nombre: "Femenino" },
    ];

    const generos = [];
    for (const gen of generosData) {
      const genero = await prisma.genero.upsert({
        where: { nombre: gen.nombre },
        update: {},
        create: {
          nombre: gen.nombre,
        },
      });
      generos.push(genero);
    }
    console.log("Géneros creados:", generos.length);

    // 5. Crear Ámbitos
    const ambitosData = [
      { nombre: "rural" },
      { nombre: "urbano" },
    ];

    const ambitos = [];
    for (const amb of ambitosData) {
      const ambito = await prisma.ambito.upsert({
        where: { nombre: amb.nombre },
        update: {},
        create: {
          nombre: amb.nombre,
        },
      });
      ambitos.push(ambito);
    }
    console.log("Ámbitos creados:", ambitos.length);

    // 6. Crear Intervalos de Edad
    const edadIntervalosData = [
      { intervalo: "Menores de 1 año" },
      { intervalo: "De 1 a 4 años" },
      { intervalo: "De 5 a 9 años" },
      { intervalo: "De 10 a 14 años" },
      { intervalo: "De 15 a 19 años" },
      { intervalo: "De 20 a 24 años" },
      { intervalo: "De 25 a 29 años" },
      { intervalo: "De 30 a 34 años" },
      { intervalo: "De 35 a 39 años" },
      { intervalo: "De 40 a 44 años" },
      { intervalo: "De 45 a 49 años" },
      { intervalo: "De 50 a 54 años" },
      { intervalo: "De 55 a 59 años" },
      { intervalo: "De 60 a 64 años" },
      { intervalo: "De 65 y más años" },
    ];

    const edadIntervalos = [];
    for (const interval of edadIntervalosData) {
      const edadIntervalo = await prisma.edadIntervalo.upsert({
        where: { intervalo: interval.intervalo },
        update: {},
        create: {
          intervalo: interval.intervalo,
        },
      });
      edadIntervalos.push(edadIntervalo);
    }
    console.log("Intervalos de edad creados:", edadIntervalos.length);

    // 7. Crear Ubicaciones
    const ubicacionesData = [
      // Cangallo (provinciaId = 1, distritos 1-6)
      ...Array.from({ length: 6 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[0].id,
        distritoId: distritos[i].id,
      })),
      // Huamanga (provinciaId = 2, distritos 7-22)
      ...Array.from({ length: 16 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[1].id,
        distritoId: distritos[i + 6].id,
      })),
      // Huanca Sancos (provinciaId = 3, distritos 23-26)
      ...Array.from({ length: 4 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[2].id,
        distritoId: distritos[i + 22].id,
      })),
      // Huanta (provinciaId = 4, distritos 27-39)
      ...Array.from({ length: 13 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[3].id,
        distritoId: distritos[i + 26].id,
      })),
      // La Mar (provinciaId = 5, distritos 40-54)
      ...Array.from({ length: 15 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[4].id,
        distritoId: distritos[i + 39].id,
      })),
      // Lucanas (provinciaId = 6, distritos 55-75)
      ...Array.from({ length: 21 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[5].id,
        distritoId: distritos[i + 54].id,
      })),
      // Parinacochas (provinciaId = 7, distritos 76-83)
      ...Array.from({ length: 8 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[6].id,
        distritoId: distritos[i + 75].id,
      })),
      // Paucar del Sara Sara (provinciaId = 8, distritos 84-93)
      ...Array.from({ length: 10 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[7].id,
        distritoId: distritos[i + 83].id,
      })),
      // Sucre (provinciaId = 9, distritos 94-104)
      ...Array.from({ length: 11 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[8].id,
        distritoId: distritos[i + 93].id,
      })),
      // Victor Fajardo (provinciaId = 10, distritos 105-116)
      ...Array.from({ length: 12 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[9].id,
        distritoId: distritos[i + 104].id,
      })),
      // Vilcas Huaman (provinciaId = 11, distritos 117-124)
      ...Array.from({ length: 8 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[10].id,
        distritoId: distritos[i + 116].id,
      })),
    ];

    const ubicaciones = [];
    for (const ubi of ubicacionesData) {
      const ubicacion = await prisma.ubicacion.upsert({
        where: {
          departamentoId_provinciaId_distritoId: {
            departamentoId: ubi.departamentoId,
            provinciaId: ubi.provinciaId,
            distritoId: ubi.distritoId,
          },
        },
        update: {},
        create: {
          departamentoId: ubi.departamentoId,
          provinciaId: ubi.provinciaId,
          distritoId: ubi.distritoId,
        },
      });
      ubicaciones.push(ubicacion);
    }
    console.log("Ubicaciones creadas:", ubicaciones.length);

    // 8. Crear Poblaciones
    const poblacionesData = [];
    for (const ubicacion of ubicaciones) {
      for (const ambito of ambitos) {
        for (const edadIntervalo of edadIntervalos) {
          for (const genero of generos) {
            poblacionesData.push({
              anio: 2025,
              cantidad: 0,
              ubicacionId: ubicacion.id,
              ambitoId: ambito.id,
              edadIntervaloId: edadIntervalo.id,
              generoId: genero.id,
            });
          }
        }
      }
    }

    await prisma.poblacion.createMany({
      data: poblacionesData,
      skipDuplicates: true,
    });
    console.log("Poblaciones creadas:", poblacionesData.length);

    console.log("Datos iniciales subidos correctamente.");

  } catch (error) {
    console.error("Error al subir los datos iniciales:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();