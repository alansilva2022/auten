import { Role } from "../role";

export interface Usuario {
   name: string;
   email: string;
   password: string;
   role: Role  //string
}