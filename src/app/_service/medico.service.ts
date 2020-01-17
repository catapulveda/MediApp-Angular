import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Medico } from '../_model/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  /*Es como un listener que se inicializa en el componente donde queremos que ocurra algo (TABLA O LISTA DE PACIENTES)
  Se usa para notificarle con el metodo next(), que ocurrio un cambio. Al momento de modificar o registrar, se llama al metodo next 
  y desde el componente donde se muestra la tabla de medicos, estara en escucha(suscrito), 
  por lo tanto  se programa que refresque la tabla con los cambios realizados en el componente donde se modifico o a registro*/
  notificadorLista = new Subject<Medico[]>();
  notificadorMensaje = new Subject<string>()

  url: string = `${environment.HOST}/medicos`

  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Medico[]>(this.url);
  }

  listarPorId(idMedico:number){
    return this.http.get<Medico>(`${this.url}/${idMedico}`);
  }

  registrar(medico: Medico) {
    return this.http.post(this.url, medico);
  }

  modificar(medico: Medico) {
    return this.http.put(this.url, medico);
  }

  eliminar(idMedico: number) {    
    return this.http.delete(`${this.url}/${idMedico}`);
  }
}
