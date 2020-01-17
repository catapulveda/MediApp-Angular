import { Paciente } from './../../../_model/paciente';
import { PacienteService } from './../../../_service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  form: FormGroup;//asocia y representa los datos del formulario

  id: number;
  editar: boolean;

  constructor(private route: ActivatedRoute, //Activar para poder trabajar con forms y recibir los datos que vienen por la url
    private pacienteService: PacienteService,
    private router : Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'documento': new FormControl(''),
      'direccion': new FormControl(''),
      'telefono': new FormControl('')
    });

    this.route.params.subscribe( (params: Params) =>{//recibo los parametros del formulario
      this.id = params['id'];
      this.editar = params['id'] != null;
      this.initForm();
    });

  }

  initForm(){
    if(this.editar){
      this.pacienteService.listarPorId(this.id).subscribe(data =>{
        this.form = new FormGroup({
          'id': new FormControl(data.idPaciente),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),
          'documento': new FormControl(data.documento),
          'direccion': new FormControl(data.direccion),
          'telefono': new FormControl(data.telefono)
        });
      });
    }
  }

  operar(){
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.documento = this.form.value['documento'];
    paciente.direccion = this.form.value['direccion'];
    paciente.telefono = this.form.value['telefono'];

    if (this.editar) {
      //servicio de edicion
      this.pacienteService.modificar(paciente).subscribe(() => {
        this.pacienteService.listar().subscribe(data => {
           this.pacienteService.pacienteCambio.next(data);
           this.pacienteService.mensajeCambio.next('SE MODIFICO');
        });
      });
    } else {
      //servicio de registro
      this.pacienteService.registrar(paciente).subscribe(() => {
        this.pacienteService.listar().subscribe(data => {
           this.pacienteService.pacienteCambio.next(data);//notificamos el cambio a la variable reactiva para que pueda refrescar la tabla con los datos
           this.pacienteService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }

     this.router.navigate(['paciente']);
  }

}
