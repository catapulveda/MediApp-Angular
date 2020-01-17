import { ConsultaService } from 'src/app/_service/consulta.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  chart: any;
  tipo: string;
  pdfSrc: string;//VARIABLE PARA ASIGNAR LA RUTA DEL PDF

  nombreArchivo: string;//STRING DEL ARCHIVO SELECCIONADO
  archivosSeleccionados: FileList;
  archivoASubir: File;

  rutaImagen: any;
  imagenEstado: boolean = false; 

  //DomSanitizer-> DA LA SEGURIDAD NECESARIA PARA QUE EL NAVEGADOR PERMITA MOSTRAR IMAGENES EN BASE64
  constructor(private consultaService: ConsultaService, private sanitization : DomSanitizer) { }

  ngOnInit() {
    this.tipo = 'line';
    this.dibujar();

    this.consultaService.leerArchivo().subscribe(data => {
      this.convertir(data);
    });
  }

  convertir(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let x = reader.result;                
      //console.log(x); //base64
      this.setear(x);
    }
  }

  setear(x:any){
    this.rutaImagen = this.sanitization.bypassSecurityTrustResourceUrl(x);
    this.imagenEstado = true;
  }

  cambiarGrafico(tipo: string) {
    this.tipo = tipo;
     if (this.chart) {
      this.chart.destroy();
    }
    this.dibujar(); 
  }

  dibujar(){
    this.consultaService.listarResumen().subscribe(datos=>{
      let cantidad = datos.map(res => res.cantidad);//EXTRA UN ARREGLO DE LA PROPIEDAD INDICADA. EN ESTE CASO EXTRAE UN ARREGÑP DE LAS CANTIDADES TOTALES
      let fechas = datos.map(res => res.fecha);//EXTRAE UN ARREGLO DE LOS STRING DE LAS FECHAS

      this.chart = new Chart('canvas', {
        type: this.tipo,
        data: {
          labels: fechas,
          datasets: [
            {
              label: 'Cantidad',
              data: cantidad,
              borderColor: "#3cba9f",
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 0, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ]
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
    });
  }

  //GENERA Y VISUALIZA EL PDF DENTRO DE UNA ETIQUETA <pdf-viewer></pdf-viewer>
  generarReporte(){
    this.consultaService.generarReporte().subscribe(bytes=>{
      let reader = new FileReader();//CREO EL ARCHIVO EN MEMORIA
      reader.onload = (e: any) => {//LE ASIGNO EL STRING DEL PDF QUE SE CONSTRUYO AL ENVIAR COMO PARAMETRO LOS BYTES
        this.pdfSrc = e.target.result;
      }
      reader.readAsArrayBuffer(bytes);
    });
  }

  //DESCARGAR 
  descargarReporte(){
    this.consultaService.generarReporte().subscribe(bytes=>{
      const url = window.URL.createObjectURL(bytes);
      //console.log(url);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'archivo.pdf'
      a.click();    
    });
  }

  seleccionarArchivo(e: any) {
    console.log(e);
    this.nombreArchivo = e.target.files[0].name;//OBTENGO EL NOMBRE DEL PRIMER ARCHIVO SELECCIONADO
    this.archivosSeleccionados = e.target.files;//OBTENGO LOS ARCHIVOS SELECCIONADOS
  }

  subirArchivos(){
    this.archivoASubir = this.archivosSeleccionados.item(0);

    this.consultaService.guardarArchivo(this.archivoASubir).subscribe(data => {
      console.log(data);
      this.archivosSeleccionados = undefined;
    });
  }

  accionImagen(accion: string){
    if(accion === "M"){
      this.imagenEstado = true;
    }else{
      this.imagenEstado = false;
    }    
  }  

}
