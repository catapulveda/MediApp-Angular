import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator, MatSort, MatSnackBar} from '@angular/material';
import {switchMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {ExamenService} from 'src/app/_service/examen.service';
import {Examen} from 'src/app/_model/examen';

@Component({
    selector: 'app-examen',
    templateUrl: './examen.component.html',
    styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {

    displayedColumns = ['id', 'nombre', 'descripcion', 'acciones'];
    dataSource: MatTableDataSource<Examen>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    mensaje: string;

    constructor(private examenService: ExamenService, public snackBar: MatSnackBar) {
    }

    ngOnInit() {
        //PARA LEER DOS OBSERVABLES AL MISMO TIEMPO
        /*let obs1 = this.examenService.listar();
        let obs2 = this.examenService.listarPorId(1);

        forkJoin(obs1, obs2).subscribe(data => {
          console.log(data);
        });*/


        this.examenService.notificadorLista.subscribe(examenes => {
            this.dataSource = new MatTableDataSource(examenes);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });

        this.examenService.notificadorMensaje.subscribe(data => {
            this.snackBar.open(data, 'Aviso', {duration: 2000});
        });

        this.examenService.listar().subscribe(data => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });

    }

    filtrar(valor: string) {
        valor = valor.trim();
        valor = valor.toLowerCase();
        this.dataSource.filter = valor;
    }

    eliminar(idExamen: number) {
        this.examenService.eliminar(idExamen).pipe(switchMap(() => {
            return this.examenService.listar();
        })).subscribe(examenes => {
            this.examenService.notificadorLista.next(examenes);
            this.examenService.notificadorMensaje.next('EXAMEN ELIMINADO');
        });
    }

}