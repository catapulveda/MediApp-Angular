import {environment} from './../environments/environment';
import {MaterialModule} from './material/material.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PacienteComponent} from './pages/paciente/paciente.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {PacienteEdicionComponent} from './pages/paciente/paciente-edicion/paciente-edicion.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MedicoComponent} from './pages/medico/medico.component';
import {MedicoDialogoComponent} from './pages/medico/medico-dialogo/medico-dialogo.component';
import {ExamenComponent} from './pages/examen/examen.component';
import {EspecialidadComponent} from './pages/especialidad/especialidad.component';
import {ExamenEdicionComponent} from './pages/examen/examen-edicion/examen-edicion.component';
import {EspecialidadEdicionComponent} from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import {ConsultaComponent} from './pages/consulta/consulta.component';
import {EspecialComponent} from './pages/consulta/especial/especial.component';
import {BuscarComponent} from './pages/buscar/buscar.component';
import {DialogoDetalleConsultaComponent} from './pages/buscar/dialogo-detalle-consulta/dialogo-detalle-consulta.component';
import {ReporteComponent} from './pages/reporte/reporte.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {LoginComponent} from './login/login.component';

import {JwtModule} from "@auth0/angular-jwt";

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {Not403Component} from './pages/not403/not403.component';
import {RecuperarComponent} from './login/recuperar/recuperar.component';
import {TokenComponent} from './login/recuperar/token/token.component';
import {ServerErrorsInterceptor} from './_shared/server-errors-interceptor';
import { SignosVitalesComponent } from './pages/signos-vitales/signos-vitales.component';
import { ActionSignosVitalesComponent } from './pages/signos-vitales/action/action.component';

export function tokenGetter() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    let tk = token != null ? token : '';
    return tk;
}

@NgModule({
    declarations: [
        AppComponent,
        PacienteComponent,
        PacienteEdicionComponent,
        MedicoComponent,
        MedicoDialogoComponent,
        ExamenComponent,
        EspecialidadComponent,
        ExamenEdicionComponent,
        EspecialidadEdicionComponent,
        ConsultaComponent,
        EspecialComponent,
        BuscarComponent,
        DialogoDetalleConsultaComponent,
        ReporteComponent,
        LoginComponent,
        Not403Component,
        RecuperarComponent,
        TokenComponent,
        SignosVitalesComponent,
        ActionSignosVitalesComponent
    ],
    entryComponents: [MedicoDialogoComponent, DialogoDetalleConsultaComponent, ActionSignosVitalesComponent],//los dialogos modales se deben registrar aqui para que puedan ser llamados desde otro componente
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MaterialModule,//archivo creado e importado aqui, para no colocar todo en este app.module
        ReactiveFormsModule,//Para usar formularios de forma estandar
        FormsModule,//[(ngModel)] -> Modulo para trabajar con Two-Way-Binding en formularios
        PdfViewerModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: ['localhost:8080'],//['167.172.145.245'],//INDICA EL DOMINIO A QUIEN SE LE DEBE MANDAR SIEMPRE EL TOKEN
                blacklistedRoutes: ['http://localhost:8080/login/enviarCorreo']//['http://167.172.145.245/mediapp-backend/login/enviarCorreo']//EXCLUIR AQUELLAS QUE NO NECESITEN TOKEN
            }
        })
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ServerErrorsInterceptor,
            multi: true,
        },
        {provide: LocationStrategy, useClass: HashLocationStrategy}//GENERA UN SIGNO # PARA NAVEGACION EN ANGULAR Y QUE TOMCAT NO CREA QUE ES UN SERVLET
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
