import {MatPaginator} from '@angular/material/paginator';
import {Paciente} from './../../_model/paciente';
import {PacienteService} from './../../_service/paciente.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-paciente',
    templateUrl: './paciente.component.html',
    styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

    dataSource: MatTableDataSource<Paciente>;//Para almacenar los pacientes
    displayedColumns = ['idPaciente', 'nombres', 'apellidos', 'acciones']; //las columnas que se necesitan mostrar..

    @ViewChild(MatSort, {static: true}) sort: MatSort;//Para porder ordenar en memoria haciendo clic en las columnas
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;//para paginar la tabla

    totalPacientes: number;

    constructor(private pacienteService: PacienteService, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        /*Activo esta variable reactiva para que se accione cuando haya sido alterada por las acciones de registrar o modificar */
        this.pacienteService.pacienteCambio.subscribe(datos => {
            this.dataSource = new MatTableDataSource(datos);//crea y asigna el modelo de datos a la tabla
            this.dataSource.sort = this.sort;//asocia la variable de ordenamiento al dataSource
            this.dataSource.paginator = this.paginator;//asocia la variable paginator al dataSource y establece la paginacion de la tabla
        });

        this.pacienteService.mensajeCambio.subscribe(data => {
            this.snackBar.open(data, 'AVISO', {
                duration: 2000
            });
        });

        /* this.pacienteService.listar().subscribe(datos =>{
          this.dataSource = new MatTableDataSource(datos);//crea y asigna el modelo de datos a la tabla
          this.dataSource.sort = this.sort;//asocia la variable de ordenamiento al dataSource
          this.dataSource.paginator = this.paginator;//asocia la variable paginator al dataSource y establece la paginacion de la tabla
        }); */

        this.pacienteService.listarPageable(0, 10).subscribe(datos => {
            this.totalPacientes = datos.totalElements;

            this.dataSource = new MatTableDataSource(datos.content);//crea y asigna el modelo de datos a la tabla
            this.dataSource.sort = this.sort;//asocia la variable de ordenamiento al dataSource
            this.dataSource.paginator = this.paginator;//asocia la variable paginator al dataSource y establece la paginacion de la tabla
        });
    }

    paginar(e: any) {
        this.pacienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(datos => {
            this.totalPacientes = datos.totalElements;
            this.totalPacientes = datos.totalElements;

            this.dataSource = new MatTableDataSource(datos.content);
            this.dataSource.sort = this.sort;
            //this.dataSource.paginator = this.paginator;  -> YA NO SERA NECESARIO ASIGNAR EL PAGINADOR NUEVAMENTE, PUES EL CALCULO DE LAS PAGINAS ESTARA EN LA PRIMERA VEZ
        });
    }

    filtrar(valor: string) {
        this.dataSource.filter = valor.trim().toLowerCase();
    }

    eliminar(idPaciente: number) {
        this.pacienteService.eliminar(idPaciente).subscribe(() => {//elimino el paciente segun el id y ejecto al terminar la accion
            this.pacienteService.listar().subscribe(datos => {//consulto la base de datos y le decimos a la variable reactiva que hubo en cambio
                this.pacienteService.pacienteCambio.next(datos);
                this.pacienteService.mensajeCambio.next('SE ELIMINO');
            })
        });
    }

}
