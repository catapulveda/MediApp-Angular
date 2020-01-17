import { BuscarComponent } from './pages/buscar/buscar.component';
import { EspecialComponent } from './pages/consulta/especial/especial.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { PacienteEdicionComponent } from './pages/paciente/paciente-edicion/paciente-edicion.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamenComponent } from './pages/examen/examen.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { ExamenEdicionComponent } from './pages/examen/examen-edicion/examen-edicion.component';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {path: 'paciente', component: PacienteComponent, children:[
      {path: 'nuevo', component: PacienteEdicionComponent},//RUTA http://localhost:4200/paciente/nuevo muestra el formulario de registro en blanco
      {path: 'edicion/:id', component: PacienteEdicionComponent}//http://localhost:4200/paciente/2 Muestra el formulario con los datos del id pasado como parametro para poder ser editado
    ]
  },

  {path: 'medico', component: MedicoComponent},

  {path: 'examen', component: ExamenComponent, children:[
      {path: 'nuevo', component: ExamenEdicionComponent},
      {path: 'edicion/:id', component: ExamenEdicionComponent}
    ]
  },

  {path: 'especialidad', component: EspecialidadComponent, children:[
      {path: 'nuevo', component: EspecialidadEdicionComponent},
      {path: 'edicion/:id', component: EspecialidadEdicionComponent}
    ]
  },

  {path: 'consulta', component: ConsultaComponent},

  { path: 'consulta-especial', component: EspecialComponent },

  {path: 'buscar', component: BuscarComponent},
  
  {path: 'reporte', component: ReporteComponent},

  {path: 'login', component: LoginComponent},

  {path: '', redirectTo: 'login', pathMatch: 'full'} //pathMatch anade automaticamente :4200
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
