import { Paciente } from './paciente';
export class SignosVitales {
    id: number;
    temperatura: string;
    fecha: string;
    pulso: string;
    ritmoRespiratorio: string;
    paciente: Paciente
}