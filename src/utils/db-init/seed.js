const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const sidebarMenus = [
  {
    title: "Menú",
    menu: [
      { label: "Dashboard", url: "/admin" },
    ],
  },
  {
    title: "Temáticas",
    menu: [
      {
        label: "Salud y Nutrición",
        url: "",
        items: [
          { label: "Protección Social", url: "/admin/issue/health-and-nutrition" },
          { label: "Educación", url: "/admin/issue/health-and-nutrition/ed" },
          { label: "Salud y Nutrición", url: "/admin/issue/health-and-nutrition/sa" },
        ],
      },
      { label: "Educación", url: "/admin/issue/education" },
      { label: "Protección Social", url: "/admin/issue/social-protection" },
      { label: "Servicios Básicos", url: "/admin/issue/basic-services" },
      { label: "Desarrollo Económico", url: "/admin/issue/economic-development" },
      { label: "Incluir para crecer", url: "/admin/issue/include-to-grow" },
      { label: "Normas e información", url: "/admin/issue/rules-and-information" },
      { label: "Notas de Actualidad", url: "/admin/issue/present" },
      { label: "Participación ciudadana", url: "/admin/issue/citizen-participation" },
    ],
  },
  {
    title: "Acceso",
    menu: [
      { label: "Usuarios", url: "/admin/access/users" },
      { label: "Roles", url: "/admin/access/role" },
      { label: "Permisos", url: "/admin/access/permissions" },
    ],
  },
  {
    title: "Configuración",
    menu: [
      { label: "Cuenta", url: "/admin/account" },
    ],
  },
];

async function seedDatabase() {
  try {
    // 1. Crear el usuario Admin
    const adminPassword = await bcrypt.hash("12345678", 12);
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@admin.com" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@admin.com",
        passwordHash: adminPassword,
        emailVerified: new Date(),
      },
    });
    console.log("Usuario Admin creado con ID:", adminUser.id);

    // 2. Crear módulos y submódulos
    const moduleMap = new Map();
    for (const group of sidebarMenus) {
      for (const item of group.menu) {
        const moduleItem = await prisma.module.upsert({
          where: { name: item.label },
          update: { url: item.url || null },
          create: {
            name: item.label,
            url: item.url || null,
            grupo: group.title,
          },
        });
        moduleMap.set(item.label, moduleItem.id);

        if (item.items && item.items.length > 0) {
          for (const subItem of item.items) {
            const subModule = await prisma.module.upsert({
              where: { name: subItem.label },
              update: { url: subItem.url || null, parentId: moduleItem.id },
              create: {
                name: subItem.label,
                url: subItem.url || null,
                parentId: moduleItem.id,
                grupo: group.title,
              },
            });
            moduleMap.set(subItem.label, subModule.id);
          }
        }
      }
    }

    // 3. Crear el rol Admin con todos los módulos
    const adminRole = await prisma.role.upsert({
      where: { name: "Admin" },
      update: {},
      create: {
        name: "Admin",
        description: "Rol con acceso completo a todos los módulos",
        defaultModule: [
          "dasboard",
          "salud_nutricion",
          "educacion",
          "proteccion_social",
          "servicios_basicos",
          "desarrollo_economico",
          "politica_incluir",
          "normas_informes",
          "notas_actualidad",
          "participacion_ciudadana",
        ],
      },
    });

    // 4. Asignar el rol Admin al usuario
    await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        roleId: adminRole.id,
      },
    });
    console.log("Rol Admin asignado al usuario con ID:", adminUser.id);

    console.log("Datos iniciales subidos correctamente:");
    console.log("Módulos creados:", moduleMap.size);
    console.log("Rol Admin creado con ID:", adminRole.id);

  } catch (error) {
    console.error("Error al subir los datos iniciales:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();