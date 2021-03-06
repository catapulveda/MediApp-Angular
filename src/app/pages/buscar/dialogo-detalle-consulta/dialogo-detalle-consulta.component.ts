import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConsultaService} from 'src/app/_service/consulta.service';
import {ConsultaListaExamenDTO} from './../../../_dto/ConsultaListaExamenDTO';
import {Consulta} from './../../../_model/consulta';
import {Component, OnInit, Inject} from '@angular/core';
import {Examen} from '../../../_model/examen';


@Component({
    selector: 'app-dialogo-detalle-consulta',
    templateUrl: './dialogo-detalle-consulta.component.html',
    styleUrls: ['./dialogo-detalle-consulta.component.css']
})
export class DialogoDetalleConsultaComponent implements OnInit {

    consulta: Consulta;
    examenes: Examen[];

    constructor(
        private dialogRef: MatDialogRef<DialogoDetalleConsultaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Consulta,
        private consultaService: ConsultaService) {
    }

    ngOnInit() {
        this.consulta = this.data;
        this.listarExamenes();
    }

    listarExamenes() {
        this.consultaService.listarExamenPorConsulta(this.consulta.idConsulta)
            .subscribe((data: ConsultaListaExamenDTO) => {
                console.log(data);
                this.examenes = data.examen;
            });
    }

    cerrar() {
        this.dialogRef.close();
    }
}
