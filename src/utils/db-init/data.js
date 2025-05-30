import { PrismaClient } from "@prisma/client";

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
      try {
        const provincia = await prisma.provincia.upsert({
          where: {
            nombre_departamentoId: {
              nombre: prov.nombre,
              departamentoId: prov.departamentoId,
            },
          },
          update: {},
          create: {
            nombre: prov.nombre,
            departamentoId: prov.departamentoId,
          },
        });
        provincias.push(provincia);
      } catch (error) {
        console.error(`Error al crear provincia ${prov.nombre}:`, error.message);
        throw error;
      }
    }
    console.log("Provincias creadas:", provincias.length);

    // 3. Crear Distritos
    const distritosData = [
      // Cangallo
      { nombre: "CANGALLO", provinciaId: provincias[0].id, ubigeoDistrital: "050201" },
      { nombre: "CHUSCHI", provinciaId: provincias[0].id, ubigeoDistrital: "050202" },
      { nombre: "LOS MOROCHUCOS", provinciaId: provincias[0].id, ubigeoDistrital: "050203" },
      { nombre: "MARIA PARADO DE BELLIDO", provinciaId: provincias[0].id, ubigeoDistrital: "050204" },
      { nombre: "PARAS", provinciaId: provincias[0].id, ubigeoDistrital: "050205" },
      { nombre: "TOTOS", provinciaId: provincias[0].id, ubigeoDistrital: "050206" },
      // Huamanga
      { nombre: "ACOCRO", provinciaId: provincias[1].id, ubigeoDistrital: "050102" },
      { nombre: "ACOS VINCHOS", provinciaId: provincias[1].id, ubigeoDistrital: "050103" },
      { nombre: "ANDRES AVELINO CACERES DORREGARAY", provinciaId: provincias[1].id, ubigeoDistrital: "050116" },
      { nombre: "AYACUCHO", provinciaId: provincias[1].id, ubigeoDistrital: "050101" },
      { nombre: "CARMEN ALTO", provinciaId: provincias[1].id, ubigeoDistrital: "050104" },
      { nombre: "CHIARA", provinciaId: provincias[1].id, ubigeoDistrital: "050105" },
      { nombre: "JESUS NAZARENO", provinciaId: provincias[1].id, ubigeoDistrital: "050115" },
      { nombre: "OCROS", provinciaId: provincias[1].id, ubigeoDistrital: "050106" },
      { nombre: "PACAYCASA", provinciaId: provincias[1].id, ubigeoDistrital: "050107" },
      { nombre: "QUINUA", provinciaId: provincias[1].id, ubigeoDistrital: "050108" },
      { nombre: "SAN JOSE DE TICLLAS", provinciaId: provincias[1].id, ubigeoDistrital: "050109" },
      { nombre: "SAN JUAN BAUTISTA", provinciaId: provincias[1].id, ubigeoDistrital: "050110" },
      { nombre: "SANTIAGO DE PISCHA", provinciaId: provincias[1].id, ubigeoDistrital: "050111" },
      { nombre: "SOCOS", provinciaId: provincias[1].id, ubigeoDistrital: "050112" },
      { nombre: "TAMBILLO", provinciaId: provincias[1].id, ubigeoDistrital: "050113" },
      { nombre: "VINCHOS", provinciaId: provincias[1].id, ubigeoDistrital: "050114" },
      // Huanca Sancos
      { nombre: "CARAPO", provinciaId: provincias[2].id, ubigeoDistrital: "050302" },
      { nombre: "SACSAMARCA", provinciaId: provincias[2].id, ubigeoDistrital: "050303" },
      { nombre: "SANCOS", provinciaId: provincias[2].id, ubigeoDistrital: "050301" },
      { nombre: "SANTIAGO DE LUCANAMARCA", provinciaId: provincias[2].id, ubigeoDistrital: "050304" },
      // Huanta
      { nombre: "AYAHUANCO", provinciaId: provincias[3].id, ubigeoDistrital: "050402" },
      { nombre: "CANAYRE", provinciaId: provincias[3].id, ubigeoDistrital: "050409" },
      { nombre: "CHACA", provinciaId: provincias[3].id, ubigeoDistrital: "050412" },
      { nombre: "HUAMANGUILLA", provinciaId: provincias[3].id, ubigeoDistrital: "050403" },
      { nombre: "HUANTA", provinciaId: provincias[3].id, ubigeoDistrital: "050401" },
      { nombre: "IGUAIN", provinciaId: provincias[3].id, ubigeoDistrital: "050404" },
      { nombre: "LLOCHEGUA", provinciaId: provincias[3].id, ubigeoDistrital: "050408" },
      { nombre: "LURICOCHA", provinciaId: provincias[3].id, ubigeoDistrital: "050405" },
      { nombre: "PUCACOLPA", provinciaId: provincias[3].id, ubigeoDistrital: "050411" },
      { nombre: "PUTIS", provinciaId: provincias[3].id, ubigeoDistrital: "050413" },
      { nombre: "SANTILLANA", provinciaId: provincias[3].id, ubigeoDistrital: "050406" },
      { nombre: "SIVIA", provinciaId: provincias[3].id, ubigeoDistrital: "050407" },
      { nombre: "UCHURACCAY", provinciaId: provincias[3].id, ubigeoDistrital: "050410" },
      // La Mar
      { nombre: "ANCHIHUAY", provinciaId: provincias[4].id, ubigeoDistrital: "050510" },
      { nombre: "ANCO", provinciaId: provincias[4].id, ubigeoDistrital: "050502" },
      { nombre: "AYNA", provinciaId: provincias[4].id, ubigeoDistrital: "050503" },
      { nombre: "CHILCAS", provinciaId: provincias[4].id, ubigeoDistrital: "050504" },
      { nombre: "CHUNGUI", provinciaId: provincias[4].id, ubigeoDistrital: "050505" },
      { nombre: "LUIS CARRANZA", provinciaId: provincias[4].id, ubigeoDistrital: "050506" },
      { nombre: "NINABAMBA", provinciaId: provincias[4].id, ubigeoDistrital: "050514" },
      { nombre: "ORONCCOY", provinciaId: provincias[4].id, ubigeoDistrital: "050511" },
      { nombre: "PATIBAMBA", provinciaId: provincias[4].id, ubigeoDistrital: "050515" },
      { nombre: "RIO MAGDALENA", provinciaId: provincias[4].id, ubigeoDistrital: "050513" },
      { nombre: "SAMUGARI", provinciaId: provincias[4].id, ubigeoDistrital: "050509" },
      { nombre: "SAN MIGUEL", provinciaId: provincias[4].id, ubigeoDistrital: "050501" },
      { nombre: "SANTA ROSA", provinciaId: provincias[4].id, ubigeoDistrital: "050507" },
      { nombre: "TAMBO", provinciaId: provincias[4].id, ubigeoDistrital: "050508" },
      { nombre: "UNION PROGRESO", provinciaId: provincias[4].id, ubigeoDistrital: "050512" },
      // Lucanas
      { nombre: "AUCARA", provinciaId: provincias[5].id, ubigeoDistrital: "050602" },
      { nombre: "CABANA", provinciaId: provincias[5].id, ubigeoDistrital: "050603" },
      { nombre: "CARMEN SALCEDO", provinciaId: provincias[5].id, ubigeoDistrital: "050604" },
      { nombre: "CHAVIÑA", provinciaId: provincias[5].id, ubigeoDistrital: "050605" },
      { nombre: "CHIPAO", provinciaId: provincias[5].id, ubigeoDistrital: "050606" },
      { nombre: "HUAC-HUAS", provinciaId: provincias[5].id, ubigeoDistrital: "050607" },
      { nombre: "LARAMATE", provinciaId: provincias[5].id, ubigeoDistrital: "050608" },
      { nombre: "LEONCIO PRADO", provinciaId: provincias[5].id, ubigeoDistrital: "050609" },
      { nombre: "LLAUTA", provinciaId: provincias[5].id, ubigeoDistrital: "050610" },
      { nombre: "LUCANAS", provinciaId: provincias[5].id, ubigeoDistrital: "050611" },
      { nombre: "OCAÑA", provinciaId: provincias[5].id, ubigeoDistrital: "050612" },
      { nombre: "OTOCA", provinciaId: provincias[5].id, ubigeoDistrital: "050613" },
      { nombre: "PUQUIO", provinciaId: provincias[5].id, ubigeoDistrital: "050601" },
      { nombre: "SAISA", provinciaId: provincias[5].id, ubigeoDistrital: "050614" },
      { nombre: "SAN CRISTOBAL", provinciaId: provincias[5].id, ubigeoDistrital: "050615" },
      { nombre: "SAN JUAN", provinciaId: provincias[5].id, ubigeoDistrital: "050616" },
      { nombre: "SAN PEDRO", provinciaId: provincias[5].id, ubigeoDistrital: "050617" },
      { nombre: "SAN PEDRO DE PALCO", provinciaId: provincias[5].id, ubigeoDistrital: "050618" },
      { nombre: "SANCOS", provinciaId: provincias[5].id, ubigeoDistrital: "050619" },
      { nombre: "SANTA ANA DE HUAYCAHUACHO", provinciaId: provincias[5].id, ubigeoDistrital: "050620" },
      { nombre: "SANTA LUCIA", provinciaId: provincias[5].id, ubigeoDistrital: "050621" },
      // Parinacochas
      { nombre: "CHUMPI", provinciaId: provincias[6].id, ubigeoDistrital: "050702" },
      { nombre: "CORACORA", provinciaId: provincias[6].id, ubigeoDistrital: "050701" },
      { nombre: "CORONEL CASTAÑEDA", provinciaId: provincias[6].id, ubigeoDistrital: "050703" },
      { nombre: "PACAPAUSA", provinciaId: provincias[6].id, ubigeoDistrital: "050704" },
      { nombre: "PULLO", provinciaId: provincias[6].id, ubigeoDistrital: "050705" },
      { nombre: "PUYUSCA", provinciaId: provincias[6].id, ubigeoDistrital: "050706" },
      { nombre: "SAN FRANCISCO DE RAVACAYCO", provinciaId: provincias[6].id, ubigeoDistrital: "050707" },
      { nombre: "UPAHUACHO", provinciaId: provincias[6].id, ubigeoDistrital: "050708" },
      // Paucar del Sara Sara
      { nombre: "COLTA", provinciaId: provincias[7].id, ubigeoDistrital: "050802" },
      { nombre: "CORCULLA", provinciaId: provincias[7].id, ubigeoDistrital: "050803" },
      { nombre: "LAMPA", provinciaId: provincias[7].id, ubigeoDistrital: "050804" },
      { nombre: "MARCABAMBA", provinciaId: provincias[7].id, ubigeoDistrital: "050805" },
      { nombre: "OYOLO", provinciaId: provincias[7].id, ubigeoDistrital: "050806" },
      { nombre: "PARARCA", provinciaId: provincias[7].id, ubigeoDistrital: "050807" },
      { nombre: "PAUSA", provinciaId: provincias[7].id, ubigeoDistrital: "050801" },
      { nombre: "SAN JAVIER DE ALPABAMBA", provinciaId: provincias[7].id, ubigeoDistrital: "050808" },
      { nombre: "SAN JOSE DE USHUA", provinciaId: provincias[7].id, ubigeoDistrital: "050809" },
      { nombre: "SARA SARA", provinciaId: provincias[7].id, ubigeoDistrital: "050810" },
      // Sucre
      { nombre: "BELEN", provinciaId: provincias[8].id, ubigeoDistrital: "050902" },
      { nombre: "CHALCOS", provinciaId: provincias[8].id, ubigeoDistrital: "050903" },
      { nombre: "CHILCAYOC", provinciaId: provincias[8].id, ubigeoDistrital: "050904" },
      { nombre: "HUACAÑA", provinciaId: provincias[8].id, ubigeoDistrital: "050905" },
      { nombre: "MORCOLLA", provinciaId: provincias[8].id, ubigeoDistrital: "050906" },
      { nombre: "PAICO", provinciaId: provincias[8].id, ubigeoDistrital: "050907" },
      { nombre: "QUEROBAMBA", provinciaId: provincias[8].id, ubigeoDistrital: "050901" },
      { nombre: "SAN PEDRO DE LARCAY", provinciaId: provincias[8].id, ubigeoDistrital: "050908" },
      { nombre: "SAN SALVADOR DE QUIJE", provinciaId: provincias[8].id, ubigeoDistrital: "050909" },
      { nombre: "SANTIAGO DE PAUCARAY", provinciaId: provincias[8].id, ubigeoDistrital: "050910" },
      { nombre: "SORAS", provinciaId: provincias[8].id, ubigeoDistrital: "050911" },
      // Victor Fajardo
      { nombre: "ALCAMENCA", provinciaId: provincias[9].id, ubigeoDistrital: "051002" },
      { nombre: "APONGO", provinciaId: provincias[9].id, ubigeoDistrital: "051003" },
      { nombre: "ASQUIPATA", provinciaId: provincias[9].id, ubigeoDistrital: "051004" },
      { nombre: "CANARIA", provinciaId: provincias[9].id, ubigeoDistrital: "051005" },
      { nombre: "CAYARA", provinciaId: provincias[9].id, ubigeoDistrital: "051006" },
      { nombre: "COLCA", provinciaId: provincias[9].id, ubigeoDistrital: "051007" },
      { nombre: "HUAMANQUIQUIA", provinciaId: provincias[9].id, ubigeoDistrital: "051008" },
      { nombre: "HUANCAPI", provinciaId: provincias[9].id, ubigeoDistrital: "051001" },
      { nombre: "HUANCARAYLLA", provinciaId: provincias[9].id, ubigeoDistrital: "051009" },
      { nombre: "HUALLA", provinciaId: provincias[9].id, ubigeoDistrital: "051010" },
      { nombre: "SARHUA", provinciaId: provincias[9].id, ubigeoDistrital: "051011" },
      { nombre: "VILCANCHOS", provinciaId: provincias[9].id, ubigeoDistrital: "051012" },
      // Vilcas Huaman
      { nombre: "ACCOMARCA", provinciaId: provincias[10].id, ubigeoDistrital: "051102" },
      { nombre: "CARHUANCA", provinciaId: provincias[10].id, ubigeoDistrital: "051103" },
      { nombre: "CONCEPCION", provinciaId: provincias[10].id, ubigeoDistrital: "051104" },
      { nombre: "HUAMBALPA", provinciaId: provincias[10].id, ubigeoDistrital: "051105" },
      { nombre: "INDEPENDENCIA", provinciaId: provincias[10].id, ubigeoDistrital: "051106" },
      { nombre: "SAURAMA", provinciaId: provincias[10].id, ubigeoDistrital: "051107" },
      { nombre: "VILCAS HUAMAN", provinciaId: provincias[10].id, ubigeoDistrital: "051101" },
      { nombre: "VISCHONGO", provinciaId: provincias[10].id, ubigeoDistrital: "051108" },
    ];

    const distritos = [];
    for (const dist of distritosData) {
      try {
        const distrito = await prisma.distrito.upsert({
          where: {
            nombre_provinciaId: {
              nombre: dist.nombre,
              provinciaId: dist.provinciaId,
            },
          },
          update: {
            nombre: dist.nombre,
            provinciaId: dist.provinciaId,
            ubigeoDistrital: dist.ubigeoDistrital,
          },
          create: {
            nombre: dist.nombre,
            provinciaId: dist.provinciaId,
            ubigeoDistrital: dist.ubigeoDistrital,
          },
        });
        distritos.push(distrito);
      } catch (error) {
        console.error(`Error al crear distrito ${dist.nombre}:`, error.message);
        throw error;
      }
    }
    console.log("Distritos creados:", distritos.length);

    // 4. Crear Géneros
    const generosData = [{ nombre: "masculino" }, { nombre: "femenino" }];

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
    const ambitosData = [{ nombre: "rural" }, { nombre: "urbano" }];

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
      // Cangallo
      ...Array.from({ length: 6 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[0].id,
        distritoId: distritos[i].id,
      })),
      // Huamanga
      ...Array.from({ length: 16 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[1].id,
        distritoId: distritos[i + 6].id,
      })),
      // Huanca Sancos
      ...Array.from({ length: 4 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[2].id,
        distritoId: distritos[i + 22].id,
      })),
      // Huanta
      ...Array.from({ length: 13 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[3].id,
        distritoId: distritos[i + 26].id,
      })),
      // La Mar
      ...Array.from({ length: 15 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[4].id,
        distritoId: distritos[i + 39].id,
      })),
      // Lucanas
      ...Array.from({ length: 21 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[5].id,
        distritoId: distritos[i + 54].id,
      })),
      // Parinacochas
      ...Array.from({ length: 8 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[6].id,
        distritoId: distritos[i + 75].id,
      })),
      // Paucar del Sara Sara
      ...Array.from({ length: 10 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[7].id,
        distritoId: distritos[i + 83].id,
      })),
      // Sucre
      ...Array.from({ length: 11 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[8].id,
        distritoId: distritos[i + 93].id,
      })),
      // Victor Fajardo
      ...Array.from({ length: 12 }, (_, i) => ({
        departamentoId: departamento.id,
        provinciaId: provincias[9].id,
        distritoId: distritos[i + 104].id,
      })),
      // Vilcas Huaman
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