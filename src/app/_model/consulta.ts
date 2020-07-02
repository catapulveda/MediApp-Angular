import {Medico} from 'src/app/_model/medico';
import {Paciente} from './paciente';
import {Especialidad} from './especialidad';
import {DetalleConsulta} from './detalleConsulta';

export class Consulta {

    idConsulta;
    paciente: Paciente;
    medico: Medico;
    especialidad: Especialidad;
    fecha: string;
    detalleConsulta: DetalleConsulta[];
}