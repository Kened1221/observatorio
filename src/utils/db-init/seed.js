const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Datos del sidebarMenus
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
    // 1. Crear los usuarios
    // Usuario Admin
    const adminPassword = await bcrypt.hash("12345678", 10);
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

    // Usuario Editor
    const editorPassword = await bcrypt.hash("editor123", 10);
    const editorUser = await prisma.user.upsert({
      where: { email: "editor@example.com" },
      update: {},
      create: {
        name: "Editor User",
        email: "editor@example.com",
        passwordHash: editorPassword,
        emailVerified: new Date(),
      },
    });
    console.log("Usuario Editor creado con ID:", editorUser.id);

    // Usuario Viewer
    const viewerPassword = await bcrypt.hash("viewer123", 10);
    const viewerUser = await prisma.user.upsert({
      where: { email: "viewer@example.com" },
      update: {},
      create: {
        name: "Viewer User",
        email: "viewer@example.com",
        passwordHash: viewerPassword,
        emailVerified: new Date(),
      },
    });
    console.log("Usuario Viewer creado con ID:", viewerUser.id);

    // 2. Crear módulos y submódulos
    const moduleMap = new Map();

    for (const group of sidebarMenus) {
      for (const item of group.menu) {
        const module = await prisma.module.upsert({
          where: { name: item.label },
          update: { url: item.url || null },
          create: {
            name: item.label,
            url: item.url || null,
          },
        });
        moduleMap.set(item.label, module.id);

        if (item.items && item.items.length > 0) {
          for (const subItem of item.items) {
            const subModule = await prisma.module.upsert({
              where: { name: subItem.label },
              update: { url: subItem.url || null, parentId: module.id },
              create: {
                name: subItem.label,
                url: subItem.url || null,
                parentId: module.id,
              },
            });
            moduleMap.set(subItem.label, subModule.id);
          }
        }
      }
    }

    // 3. Crear los roles
    // Rol Admin
    const adminRole = await prisma.role.upsert({
      where: { name: "Admin" },
      update: {},
      create: {
        name: "Admin",
        description: "Rol con acceso completo a todos los módulos",
        isCustom: false,
      },
    });

    // Rol Editor
    const editorRole = await prisma.role.upsert({
      where: { name: "Editor" },
      update: {},
      create: {
        name: "Editor",
        description: "Rol con permisos para leer y escribir en la mayoría de los módulos",
        isCustom: false,
      },
    });

    // Rol Viewer
    const viewerRole = await prisma.role.upsert({
      where: { name: "Viewer" },
      update: {},
      create: {
        name: "Viewer",
        description: "Rol con permisos solo de lectura en Menú y Temáticas",
        isCustom: false,
      },
    });

    // 4. Asignar roles a los usuarios
    await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        roles: {
          connect: { id: adminRole.id },
        },
      },
    });
    console.log("Rol Admin asignado al usuario con ID:", adminUser.id);

    await prisma.user.update({
      where: { id: editorUser.id },
      data: {
        roles: {
          connect: { id: editorRole.id },
        },
      },
    });
    console.log("Rol Editor asignado al usuario con ID:", editorUser.id);

    await prisma.user.update({
      where: { id: viewerUser.id },
      data: {
        roles: {
          connect: { id: viewerRole.id },
        },
      },
    });
    console.log("Rol Viewer asignado al usuario con ID:", viewerUser.id);

    // 5. Asignar permisos a los roles
    const allModules = await prisma.module.findMany();

    // Permisos para Admin (acceso completo a todos los módulos)
    const adminPermissions = allModules.map(module => ({
      roleId: adminRole.id,
      moduleId: module.id,
      canRead: true,
      canWrite: true,
      canEdit: true,
      canDelete: true,
    }));

    // Permisos para Editor
    const editorPermissions = allModules.map(module => {
      const isAccessModule = ["Usuarios", "Roles", "Permisos"].includes(module.name);
      return {
        roleId: editorRole.id,
        moduleId: module.id,
        canRead: true, // Puede leer todos los módulos
        canWrite: !isAccessModule, // Puede escribir en todos menos en "Acceso"
        canEdit: !isAccessModule, // Puede editar en todos menos en "Acceso"
        canDelete: false, // No puede eliminar en ningún módulo
      };
    });

    // Permisos para Viewer
    const viewerPermissions = allModules.map(module => {
      const isMenuOrTematicasModule = sidebarMenus
        .filter(group => ["Menú", "Temáticas"].includes(group.title))
        .flatMap(group => group.menu)
        .some(item => item.label === module.name || (item.items && item.items.some(sub => sub.label === module.name)));

      return {
        roleId: viewerRole.id,
        moduleId: module.id,
        canRead: isMenuOrTematicasModule, // Solo puede leer en "Menú" y "Temáticas"
        canWrite: false,
        canEdit: false,
        canDelete: false,
      };
    });

    // Crear los permisos en la base de datos
    await prisma.rolePermission.createMany({
      data: [...adminPermissions, ...editorPermissions, ...viewerPermissions],
      skipDuplicates: true,
    });

    console.log("Datos iniciales subidos correctamente:");
    console.log("Módulos creados:", moduleMap.size);
    console.log("Rol Admin creado con ID:", adminRole.id);
    console.log("Rol Editor creado con ID:", editorRole.id);
    console.log("Rol Viewer creado con ID:", viewerRole.id);
    console.log("Permisos asignados:", adminPermissions.length + editorPermissions.length + viewerPermissions.length);

  } catch (error) {
    console.error("Error al subir los datos iniciales:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();