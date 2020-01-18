import { DialogoDetalleConsultaComponent } from './dialogo-detalle-consulta/dialogo-detalle-consulta.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Consulta } from './../../_model/consulta';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { FiltroConsultaDTO } from './../../_dto/FiltroConsultaDTO';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})



export class BuscarComponent implements OnInit {

  form: FormGroup;
  displayedColumns = ['paciente', 'medico', 'especialidad', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<Consulta>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  buscando = false;

  constructor(private consultaService: ConsultaService, private dialogo: MatDialog) { }

  ngOnInit() {

    this.form = new FormGroup({
      'documento': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaConsulta': new FormControl()
    });

  }

  buscar() {
    this.buscando = true;
    let filtro = new FiltroConsultaDTO(this.form.value['documento'], this.form.value['nombreCompleto'], this.form.value['fechaConsulta']);
    filtro.nombreCompleto = filtro.nombreCompleto.toLowerCase();

    if (filtro.fechaConsulta) {

      delete filtro.documento;// delete ES PROPIO DE JS Y SIRVE PARA TRABAJR EN EL TEMA DE LOS OBJETOS JSON, CON ESTO ELIMINO ESTE ATRIBUTO DEL JSON QUE SE ESTA CONSTRUYENDO... NO SON NECESARIOS SI YA TENGO LA FECHA
      delete filtro.nombreCompleto;

      this.consultaService.buscar(filtro)
      .subscribe(
        data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
      );
      
    }else{
      delete filtro.fechaConsulta;

      if (filtro.documento.length === 0) {
        delete filtro.documento;
      }

      if (filtro.nombreCompleto.length === 0) {
        delete filtro.nombreCompleto
      }

      this.consultaService.buscar(filtro).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });

    }
    this.buscando = false;
  }

  verDetalle(consulta: Consulta) {
    this.dialogo.open(DialogoDetalleConsultaComponent, {
      data: consulta
    });
  }

}
