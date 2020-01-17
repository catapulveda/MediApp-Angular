import { MedicoService } from './../../../_service/medico.service';
import { Medico } from './../../../_model/medico';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css']
})
export class MedicoDialogoComponent implements OnInit {

  medico: Medico;

  constructor(
    private dialogo: MatDialogRef<MedicoDialogoComponent>, //hacemos referencia a este dialogo para poder usar las acciones del dialogo
    @Inject(MAT_DIALOG_DATA) private medicoRecibido: Medico, //permite recibir el tipo de dato que se envio desde el componente donde se abrio el dialogo
    private medicoService: MedicoService//para realizar operaciones a la base de datos
  ) { }

  ngOnInit() {
    this.medico = new Medico();
    this.medico.idMedico = this.medicoRecibido.idMedico;
    this.medico.nombres = this.medicoRecibido.nombres;
    this.medico.apellidos = this.medicoRecibido.apellidos;
    this.medico.codigoMedico = this.medicoRecibido.codigoMedico;
  }

  cancelar() {
    this.dialogo.close();
  }

  operar() {
    if (this.medico != null && this.medico.idMedico > 0) {
      /**el metodo modificar() retorna un observable vacio, pero con pipe switchMap indico que quiero continuar haciendo algo, 
       * y este metodo me obliga a retornar un observable, para luego subscribirme a la lista observable que he retornado y notificar los cambios */
      this.medicoService.modificar(this.medico).pipe(switchMap( ()=>{
        return this.medicoService.listar();
      })).subscribe( (medicos)=>{
        this.medicoService.notificadorLista.next(medicos);//le envio la nueva lista de medicos
        this.medicoService.notificadorMensaje.next("MEDICO MODIFICADO")
      });      
    } else {// NO SE RECOMIENDA HACER UN subscribe dentro de otro subscribre... un hilo espera a que termine el otro hilo
      this.medicoService.registrar(this.medico).subscribe(() => {
        this.medicoService.listar().subscribe((medicos) => {//traigo la lista de medicos desde la BD
          this.medicoService.notificadorLista.next(medicos);//le envio la nueva lista de medicos
          this.medicoService.notificadorMensaje.next("MEDICO REGISTRADO")
        });
      });
    }
    this.dialogo.close();
  }
}
