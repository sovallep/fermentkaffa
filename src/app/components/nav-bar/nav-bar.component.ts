import { Component, Input, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {

  @Input() selected;
  @Input() idCita;
  @Input() detallePaciente;
  @Input() footer = false;

  selectedInt;
  datosAseguradora;
  fechaCita;
  constructor(
    private restApiService: RestApiService
  ) { }
  datosColor = 'light';
  preConsultaColor = 'light';
  expedienteColor = 'light';
  curvaColor = 'light';
  consultaColor = 'light';
  extraColor = 'light';

  @Input() extraTitle;
  @Input() extra;
  @Input() hideDatos;
  @Input() hidePreconsulta;
  @Input() hideExpediente;
  @Input() hideCurva;
  @Input() hideConsulta;
  @Input() hideExtra;


  ngOnInit() {
    this.hideDatos = (this.hideDatos === 'true');
    this.hidePreconsulta = (this.hidePreconsulta === 'true');
    this.hideExpediente = (this.hideExpediente === 'true');
    this.hideCurva = (this.hideCurva === 'true');
    this.hideConsulta = (this.hideConsulta === 'true');
    this.hideExtra = (this.hideExtra === 'true');
    // tslint:disable-next-line: radix
    this.selectedInt = parseInt(this.selected);
    switch (this.selectedInt) {
      case 0:
        this.datosColor = 'primary';
        break;
      case 1:
        this.preConsultaColor = 'primary';
        break;
      case 2:
        this.expedienteColor = 'primary';
        break;
      case 3:
        this.curvaColor = 'primary';
        break;
      case 4:
        this.consultaColor = 'primary';
        break;
      case 5:
        this.extraColor = 'primary';
        break;
    }
    if (!this.footer) {
      setTimeout(() => {
        this.restApiService.getCita(this.idCita).then((cita: any) => {
          this.fechaCita = cita.fecha;
          this.datosAseguradora = null;
          if (cita.aseguradora) {
            if (cita.aseguradora.name) {
              this.datosAseguradora = cita.aseguradora.name;
            }
          }
          this.restApiService.getPaciente(cita.paciente._id).then((paciente: any) => {
            this.detallePaciente = paciente.codigo + ' - ' + paciente.primerNombre + ' ' + paciente.segundoNombre;
            this.detallePaciente += ' ' + paciente.primerApellido + ' ' + paciente.segundoApellido;
          });
        }).catch((e: any) => {
          console.log('error al cargar cita', this.idCita);
        });
      }, 300);
    }
  }

}
