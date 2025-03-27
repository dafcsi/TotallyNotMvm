import { VillanyoraAllas } from "./villanyora-allas.model";

export interface Felhasznalo {
    id: string;
    nev: string;
    email: string;
    aktiv: boolean;
    szerepkor: 'user' | 'admin';
    allasok: VillanyoraAllas[];
  }
  