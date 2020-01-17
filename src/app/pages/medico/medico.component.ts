import { MedicoService } from './../../_service/medico.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Medico } from 'src/app/_model/medico';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MedicoDialogoComponent } from './medico-dialogo/medico-dialogo.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  //Para almacenar los medicos
  dataSource: MatTableDataSource<Medico>;
  //las columnas a mostrar. Se debe colocar el mismo en la propiedad matColumnDef del html
  displayedColumns = ['idMedico', 'nombres', 'apellidos', 'codigoMedico', 'acciones']; 

  @ViewChild(MatSort, {static: true}) sort : MatSort;//Para porder ordenar en memoria haciendo clic en las columnas
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;//para paginar la tabla

  constructor(private medicoService: MedicoService, private dialogoModal: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.medicoService.notificadorLista.subscribe(medicos =>{//Pongo en escucha a *notificadorLista* y siempre estara pendiente cuando se inserte o modifique un nuevo medico, gracias al metodo next que se llamo desde que se registro o modifico
      //CARGO LA TABLA, ORDENO Y PAGINO
      this.dataSource = new MatTableDataSource(medicos);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.medicoService.notificadorMensaje.subscribe(mensaje=>{//AL HABER UNA NOTIFICACION, MUESTRO EL MENSAJE OBTENIDO
      this.snackBar.open(mensaje, "AVISO",{duration: 2000, verticalPosition: "top"});
    });

    this.medicoService.listar().subscribe(medicos =>{
      this.dataSource = new MatTableDataSource(medicos);//crea y asigna el modelo de datos a la tabla
      this.dataSource.sort = this.sort;//asocia la variable de ordenamiento al dataSource
      this.dataSource.paginator = this.paginator;//asocia la variable paginator al dataSource y establece la paginacion de la tabla
    });

  }

  //los dialogos se deben registrar en el app.module.ts EN LA PROPIEDAD *entryComponents* para que puedan mostrarse desde un componente
  openDialog(medico?: Medico){//SE COLOCA EL SIGNO *?* PARA INDICARLE QUE EL PARAMETRO ES OPCIONAL
    let med = medico != null ? medico : new Medico();
    this.dialogoModal.open(MedicoDialogoComponent , {
      width: '300px',
      data: med
    });
  }

  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(medico: Medico){
    this.medicoService.eliminar(medico.idMedico).pipe(switchMap( ()=>{
      return this.medicoService.listar();
    })).subscribe( (medicos)=>{
      this.medicoService.notificadorLista.next(medicos);//le envio la nueva lista de medicos
          this.medicoService.notificadorMensaje.next("MEDICO ELIMINADO")
    });
  }

}
