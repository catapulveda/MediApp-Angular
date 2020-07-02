import { Component, OnInit, Inject } from '@angular/core';
import { SignosVitales } from '../../../_model/signos-vitales';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { switchMap, map } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl } from '@angular/forms';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionSignosVitalesComponent implements OnInit {

  signosVitales: SignosVitales;
  isAdd = false;

  patiens: Paciente[] = [];
  pacientes: Observable<any[]>;
  controlPaciente: FormControl = new FormControl();

  pacienteSeleccionado: Paciente;

  constructor(
    private dialogo: MatDialogRef<ActionSignosVitalesComponent>,
    @Inject(MAT_DIALOG_DATA) private dataReceived: SignosVitales,
    private signosVitalesService: SignosVitalesService,
    private patienstSerice: PacienteService
  ) {
    if (dataReceived.id) {
      this.isAdd = false;
    } else {
      this.isAdd = true;
    }
  }

  ngOnInit() {

    this.patienstSerice.listar().subscribe(data => {
      console.log(data);
      this.patiens = data;
    });

    this.signosVitales = new SignosVitales();
    this.signosVitales.id = this.dataReceived.id;
    this.signosVitales.fecha = this.dataReceived.fecha;
    this.signosVitales.pulso = this.dataReceived.pulso;
    this.signosVitales.ritmoRespiratorio = this.dataReceived.ritmoRespiratorio;
    this.signosVitales.temperatura = this.dataReceived.temperatura;
    this.signosVitales.paciente = this.dataReceived.paciente;

    this.pacientes = this.controlPaciente.valueChanges.pipe(map(val => this.filter(val)));
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
    this.signosVitales.paciente = this.pacienteSeleccionado;
  }

textoAMostrar(val: Paciente) {
  return val ? `${val.nombres} ${val.apellidos}` : val;
}

  filter(val: any) {
    if (val != null && val.idPaciente > 0) {
        return this.patiens.filter(paciente =>
            paciente.nombres.toLowerCase().includes(val.nombres.toLowerCase()) ||
            paciente.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) )
    } else {
        return this.patiens.filter(paciente =>
            paciente.nombres.toLowerCase().includes(val.toLowerCase()) ||
            paciente.apellidos.toLowerCase().includes(val.toLowerCase()) )
    }
}

  cancelar() {
    this.dialogo.close();
  }

  operar() {
    if (this.signosVitales != null && this.signosVitales.id > 0) {
      /**el metodo modificar() retorna un observable vacio, pero con pipe switchMap indico que quiero continuar haciendo algo,
       * y este metodo me obliga a retornar un observable, para luego subscribirme a la lista observable que he retornado y notificar los cambios */
      this.signosVitalesService.update(this.signosVitales).subscribe(res => console.log(res));
    } else {// NO SE RECOMIENDA HACER UN subscribe dentro de otro subscribre... un hilo espera a que termine el otro hilo
      this.signosVitalesService.insert(this.signosVitales).subscribe(res => {
        console.log(res);
      });
    }
    this.dialogo.close();
  }

}
