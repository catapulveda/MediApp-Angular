import { ConsultaService } from './../../../_service/consulta.service';
import { ConsultaListaExamenDTO } from './../../../_dto/ConsultaListaExamenDTO';
import { Consulta } from 'src/app/_model/consulta';
import { MatSnackBar } from '@angular/material';
import { EspecialidadService } from './../../../_service/especialidad.service';
import { MedicoService } from './../../../_service/medico.service';
import { PacienteService } from './../../../_service/paciente.service';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { Examen } from 'src/app/_model/examen';
import { Medico } from 'src/app/_model/medico';
import { Especialidad } from 'src/app/_model/especialidad';
import { Paciente } from './../../../_model/paciente';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExamenService } from 'src/app/_service/examen.service';

@Component({
  selector: 'app-especial',
  templateUrl: './especial.component.html',
  styleUrls: ['./especial.component.css']
})
export class EspecialComponent implements OnInit {

  form: FormGroup;

  listaPacientes: Paciente[] = [];
  listaEspecialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  examenes: Examen[] = [];

  listaDetalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];  

  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  pacienteSeleccionado: Paciente;
  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  examenSeleccionado: Examen;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  //CORESPONDE A LOS INPUT DONDE SE DIGITA EL VALOR A BUSCAR
  inputTextPaciente: FormControl = new FormControl();
  inputTextMedico: FormControl = new FormControl();

  opcionesFiltradas: Observable<any[]>;
  medicosFiltrados: Observable<any[]>;

  constructor(private pacienteService: PacienteService,
    private consultaService: ConsultaService,
    private examenService: ExamenService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.form = new FormGroup({//CREAMOS LA ESTRUCTURA DEL FORMULARIO COMPLETO
      'paciente': this.inputTextPaciente,// 'paciente' ES EL NOMBRE QUE SE LE ASIGNO AL INPUT, Y AQUI ASOCIAMOS Y CREAMOS UNA INSTANCIA DE ESE INPUT
      'especialidad': new FormControl(),
      'medico': this.inputTextMedico,
      'fecha': new FormControl(new Date()),
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl('')
    });

    this.listarPacientes();
    this.listarEspecilidad();
    this.listarMedicos();
    this.listarExamenes();

    // SE ALMACENA LA LISTA QUE COINCINDA CON EL VALOR QUE SE ESTA ESCRIBIENDO EN EL CAMPO DE TEXTO
    //SE RECORRE LA LISTA DE PACIENTES, SE FILTRA CON EL VALOR DIGITADO EN EL CAMBIO Y SE ALMACENA UNA NUEVA LISTA SOLO CON LOS DATOS QUE COINCINDAN CON EL FILTRO    
    this.opcionesFiltradas = this.inputTextPaciente.valueChanges.pipe(map( (val) => this.filtrar(val)));
    this.medicosFiltrados = this.inputTextMedico.valueChanges.pipe(map(val => this.filterMedico(val)));

  }

  /*  */
  filtrar(val: any) {    
    if (val != null && val.idPaciente > 0) {
      //SOLO OCURRE CUANDO SELECCIONAMOS UN ITEM DE LA LISTA
      return this.listaPacientes.filter(paciente =>//Retorna la lista de pacientes con el filtro aplicado
        paciente.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || 
        paciente.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || 
        paciente.documento.includes(val.dni));
    } else {
      //SOLO OCURRE MIENTRAS ESTEMOS COPIANDO EN EL INPUT, PUES SIEMPRE SERA UN STRING
      return this.listaPacientes.filter(paciente =>
        paciente.nombres.toLowerCase().includes(val.toLowerCase()) || 
        paciente.apellidos.toLowerCase().includes(val.toLowerCase()) || 
        paciente.documento.includes(val));
    }
  }
  
  filterMedico(val: any) {
    if (val != null && val.idMedico > 0) {
      return this.medicos.filter(medico =>
        medico.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || 
        medico.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || 
        medico.codigoMedico.includes(val.cmp));
    } else {
      return this.medicos.filter(medico =>
        medico.nombres.toLowerCase().includes(val.toLowerCase()) || 
        medico.apellidos.toLowerCase().includes(val.toLowerCase()) || 
        medico.codigoMedico.includes(val));
    }
  }

  textoAMostrar(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  mostrarTextoMedico(val: Medico){
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  seleccionarMedico(e: any) {
    this.medicoSeleccionado = e.option.value;
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe(pacientes =>{
      this.listaPacientes = pacientes;
    });
  }

  listarEspecilidad() {
    this.especialidadService.listar().subscribe(data => {
      this.listaEspecialidades = data;
    })
  }

  listarMedicos() {
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    })
  }
  listarExamenes() {
    this.examenService.listar().subscribe(data => {
      this.examenes = data;
    })
  }

  agregarDetalle() {

    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      this.listaDetalleConsulta.push(det);
      this.diagnostico = null;
      this.tratamiento = null;
    } else {
      this.mensaje = `Debe agregar un diagnóstico y tramiento`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  agregarExamen() {
    if (this.examenSeleccionado) {
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
          cont++;
          break;
        }
      }
      if (cont > 0) {
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      } else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {
      this.mensaje = `Debe agregar un examen`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  estadoBotonRegistrar() {
    return (this.listaDetalleConsulta.length === 0 || this.especialidadSeleccionada === null || this.medicoSeleccionado === null || this.pacienteSeleccionado === null);
  }

  aceptar(){
    let consulta = new Consulta();
    consulta.especialidad = this.form.value['especialidad'];//this.especialidadSeleccionada;
    consulta.medico = this.form.value['medico'];// this.medicoSeleccionado;
    consulta.paciente = this.form.value['paciente'];//this.pacienteSeleccionado;

    var tzoffset = (this.form.value['fecha']).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString()
    consulta.fecha = localISOTime;

    consulta.detalleConsulta = this.listaDetalleConsulta;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.listaExamen = this.examenesSeleccionados;

    this.consultaService.registrar(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("CONSULTA REGISTRADA", "OK", {duration: 3000});

      setTimeout(() => {
        this.limpiarControles();
      }, 500);
    });
  }

  limpiarControles() {
    this.listaDetalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = null;
    this.especialidadSeleccionada = null;
    this.medicoSeleccionado = null;
    this.examenSeleccionado = null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';    
  }


}
