//Clase para representar los datos que se enviaran al backend para realizar la consulta
export class FiltroConsultaDTO {
    documento: string;
    nombreCompleto: string;
    fechaConsulta: Date;

    constructor(documento: string, nombreCompleto: string, fechaConsulta: Date) {
        this.documento = documento;
        this.nombreCompleto = nombreCompleto;
        this.fechaConsulta = fechaConsulta;
    }
}