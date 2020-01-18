import { ConsultaResumenDTO } from './../_dto/ConsultaResumenDTO';
import { Consulta } from './../_model/consulta';
import { FiltroConsultaDTO } from './../_dto/FiltroConsultaDTO';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { ConsultaListaExamenDTO } from '../_dto/ConsultaListaExamenDTO';

//@Injectable Permite que una clase se pueda exportar y utilizar como inyeccion de dependencias
@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  url: string = `${environment.HOST}/consultas`

  constructor(private http: HttpClient) { }

  registrar(consultaDTO: ConsultaListaExamenDTO) {
    return this.http.post(this.url, consultaDTO);
  }

  buscar(filtroConsulta: FiltroConsultaDTO) {
    return this.http.post<Consulta[]>(`${this.url}/buscar`, filtroConsulta);
  }

  listarExamenPorConsulta(idConsulta: number){
    return this.http.get<ConsultaListaExamenDTO>(`${environment.HOST}/consultaexamenes/${idConsulta}`);
  }

  listarResumen(){
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`);
  }

  //A PARTIR DE ANGULAR 4, ESTE ASUME QUE TODAS LAS RESPUESTAS SON EN FORMATO JSON, EN ESTE CASO AL SER UN ARCHIVO DE BYTES, SE LE DEBE DECIR QUE LA RESPUESTA SERA 'blob'
  generarReporte(){
    return this.http.get(`${this.url}/generarReporte`, {
      responseType: 'blob'
    });
  }

  guardarArchivo(data : File){
    let formdata : FormData = new FormData();
    formdata.append('file', data);    

    return this.http.post(`${this.url}/guardarArchivo`, formdata, {//ENVIO EL ARCHIVO
      responseType: 'text'//SI NO LE INDICO responseType ANGULAR CONSIDERA QUE RETORNA UN JSON
    });
  }

  leerArchivo(){
    return this.http.get(`${this.url}/leerArchivo/2`, {
      responseType: 'blob'
    });
  }

}
