import {Paciente} from './../_model/paciente';
import {environment} from './../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PacienteService {

    /*//para reaccionar a los cambios realizados al momento de insertar o modificar..
    solo se usa desde el codigo donde se registro o modifico, es decir en el formulario */
    pacienteCambio = new Subject<Paciente[]>();
    mensajeCambio = new Subject<string>()

    url: string = `${environment.HOST}/pacientes`

    constructor(private http: HttpClient) {
    }

    listar() {
        return this.http.get<Paciente[]>(this.url);
    }

    //OBTIENE UNA LISTA DE PACIENTES PAGINADA
    listarPageable(p: number, s: number) {
        return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
    }

    listarPorId(idPaciente: number) {
        return this.http.get<Paciente>(`${this.url}/${idPaciente}`);
    }

    registrar(paciente: Paciente) {
        return this.http.post(this.url, paciente);
    }

    modificar(paciente: Paciente) {
        return this.http.put(this.url, paciente);
    }

    eliminar(idPaciente: number) {

        return this.http.delete(`${this.url}/${idPaciente}`);
    }
}
