import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SignosVitales } from 'src/app/_model/signos-vitales';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';
import { ActionSignosVitalesComponent } from './action/action.component';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {

  displayedColumns = ['Temperatura', 'Pulso', 'Ritmo Respiratorio', 'Fecha', 'acciones'];
  dataSource: MatTableDataSource<SignosVitales>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  mensaje: string;

  constructor(
    private dialogoModal: MatDialog,
    private route: ActivatedRoute,
    private signosService: SignosVitalesService) { }

  ngOnInit() {

    this.signosService.findAll().subscribe(data => {
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

  openDialog(signosVitales?: SignosVitales) {//SE COLOCA EL SIGNO *?* PARA INDICARLE QUE EL PARAMETRO ES OPCIONAL
    let signos = signosVitales != null ? signosVitales : new SignosVitales();
    this.dialogoModal.open(ActionSignosVitalesComponent, {
      width: '300px',
      data: signos
    });
  }

  eliminar(value: SignosVitales) {
    this.signosService.delete(value.id).subscribe(data => {
      console.log(data);
    });
  }

}
