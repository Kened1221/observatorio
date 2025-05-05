
import { roleModule } from "@prisma/client";
import { z } from "zod";

export const RoleModule = z.nativeEnum(roleModule);
