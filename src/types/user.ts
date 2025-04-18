import { Role } from "@prisma/client";

export type UserForTable = {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
};
