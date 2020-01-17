import { MedicoService } from './../../_service/medico.service';
import { Medico } from 'src/app/_model/medico';
import { PacienteService } from './../../_service/paciente.service';
import { Paciente } from './../../_model/paciente';
import { Component, OnInit } from '@angular/core';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { MatSnackBar } from '@angular/material';
import { Consulta } from 'src/app/_model/consulta';
import {ConsultaListaExamenDTO} from '../../_dto/ConsultaListaExamenDTO';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  //lista a mostrar en el <select> correspondiente
  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  examenes: Examen[] = [];

  detallesConsulta: DetalleConsulta[]=[];
  examenesSeleccionados: Examen[] = [];

  idPacienteSeleccionado: number;
  idEspecialidadSeleccionada: number;
  idMedicoSeleccionado: number;
  idExamenSeleccionado: number;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.listarPacientes();
    this.listarEspecilidad();
    this.listarMedicos();
    this.listarExamenes();
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe(pacientes =>{
      this.pacientes = pacientes;
    });
  }

  listarEspecilidad() {
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
    });
  }

  listarMedicos() {
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    });
  }

  listarExamenes() {
    this.examenService.listar().subscribe(data => {
      this.examenes = data;
    });
  }

  agregarDetalle(){
    if(this.tratamiento!=null&&this.diagnostico!=null){
      let detalle = new DetalleConsulta();
      detalle.diagnostico = this.diagnostico;
      detalle.tratamiento = this.tratamiento;

      this.detallesConsulta.push(detalle);

      this.diagnostico = null;
      this.tratamiento = null;
    }
  }

  removerDiagnostico(index: number) {
    this.detallesConsulta.splice(index, 1);
  }

  agregarExamen() {
    if (this.idExamenSeleccionado > 0) {
      //VERIFICA SI EL EXAMEN SELECCIONADO YA ESTA AGREGADO EN LA LISTA
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.idExamenSeleccionado) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        this.mensaje = 'El examen se encuentra en la lista';
        this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      } else {
        //PARA TRAER EL NOMBRE DEL EXAMEN 
        this.examenService.listarPorId(this.idExamenSeleccionado).subscribe(ex => {
          this.examenesSeleccionados.push(ex);
        });
      }
    } else {
      this.mensaje = 'Debe agregar un examen';
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }
  
  removerExamen(index: number){    
    this.examenesSeleccionados.splice(index, 1);
  }

  estadoBotonRegistrar(){

  }

  aceptar(){
    let medico = new Medico();
    medico.idMedico = this.idMedicoSeleccionado;

    let especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionada;

    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    let consulta = new Consulta();
    consulta.especialidad = especialidad;
    consulta.medico = medico;
    consulta.paciente = paciente;

    //ISODATE
    let tzoffset = (this.fechaSeleccionada).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    //console.log(localISOTime);//yyy-mm-ddTHH:mm:ss
    consulta.fecha = localISOTime;
    consulta.detalleConsulta = this.detallesConsulta;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.listaExamen = this.examenesSeleccionados;

    this.consultaService.registrar(consultaListaExamenDTO).subscribe( ()=>{
      this.snackBar.open("CONSULTA REGISTRADA", "Aviso", {duration: 2000});

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }

  limpiarControles() {
    this.detallesConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.idPacienteSeleccionado = 0;
    this.idEspecialidadSeleccionada = 0;
    this.idMedicoSeleccionado = 0;
    this.idExamenSeleccionado = 0;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
  }

}
