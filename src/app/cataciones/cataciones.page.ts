import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestApiService, PostCatacionSensorial } from '../services/rest-api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare var google;

@Component({
  selector: 'app-cataciones',
  templateUrl: './cataciones.page.html',
  styleUrls: ['./cataciones.page.scss'],
})
export class CatacionesPage implements OnInit {

  tabla = "Catacion";
  nanolote = [];
  fermentacion = [];

  post: PostCatacionSensorial = {
    muesta: '',
    fragancia: 1,
    aroma: 1,
    sabor: 1,
    sabor_residual: 1,
    acidez: 1,
    dulzor: 1,
    boca: 1,
    global: 1,
    defectos: '',
    tazas_defectousas: 0,
    taza_no_uniformes: 0,
    total_scoree: 0,
    id_lote: 0
  };
  user = [];
  ocultar = true;
  isDisplay = true;
  userItem: [];
  userId: -1;
  entero;
  decimal;
  constructor(
    private restApiService: RestApiService,
    public loadingController: LoadingController,
    private router: Router,
  ) { }

  ngOnInit(
  ) {
    this.log();
  }

  async printDiv() {
    this.ocultar = true;
    if (this.ocultar == true) {
      setTimeout(function cb1() {
        window.print()
        // print()
      }, 500);
      this.ocultar = false;
    }
  }

  cleanPost() {
    this.post = {
      muesta: '',
      fragancia: 1,
      aroma: 1,
      sabor: 1,
      sabor_residual: 1,
      acidez: 1,
      dulzor: 1,
      boca: 1,
      global: 1,
      defectos: '',
      tazas_defectousas: 0,
      taza_no_uniformes: 0,
      total_scoree: 0,
      id_lote: 0
    };
  }

  async log() {
    const loading = await this.loadingController.create({
      message: 'Cargando Datos...',
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      this.restApiService.getListado(this.tabla).subscribe((res: any) => {
        if (res) {
          this.user = res;
          console.log(this.user);
          loading.dismiss();
        } else {
          loading.dismiss();
        }
      });
      loading.dismiss();
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
    await loading.present().then(() => {
      this.restApiService.getListado('Nanolotes').subscribe((res: any) => {
        if (res) {
          this.nanolote = res;
          loading.dismiss();
        }
      });
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }


  addProduct() {
    this.userItem = [];
    this.cleanPost();
    this.isDisplay = false;
    this.ocultar = false;
    this.drawChart();
    this.calcularTotal();
  }

  back() {
    this.userItem = [];
    this.cleanPost();
    this.isDisplay = true;
    this.ocultar = true;
  }

  onSubmit() {
    // editar uno existente
    if (this.userId != null && this.userId >= 0) {
      console.log('entro editar');
      this.update();
    } else { // crear un nuevo 
      console.log('entro nuevo item');
      this.save();
    }
  }

  async save() {
    const loading = await this.loadingController.create({
      message: 'Guardando...',
      spinner: 'crescent'
    });
    await loading.present().then(() => {
      this.restApiService.postAddItem(this.tabla, this.post).subscribe((res: any) => {
        loading.dismiss();
        this.userItem = [];
        this.isDisplay = true;
        this.ocultar = true;
        this.cleanPost();
        this.log();
      });
      loading.dismiss();
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }

  async update() {
    const loading = await this.loadingController.create({
      message: 'Guardando...',
      spinner: 'crescent'
    });
    let temp = {
      muesta: this.post.muesta,
      fragancia: this.post.fragancia,
      aroma: this.post.aroma,
      sabor: this.post.sabor,
      sabor_residual: this.post.sabor_residual,
      acidez: this.post.acidez,
      dulzor: this.post.dulzor,
      boca: this.post.boca,
      global: this.post.global,
      defectos: this.post.defectos,
      tazas_defectousas: this.post.tazas_defectousas,
      taza_no_uniformes: this.post.taza_no_uniformes,
      total_scoree: this.post.total_scoree,
      id_lote: this.post.id_lote
    }
    await loading.present().then(() => {
      this.restApiService.putEditItem(this.tabla, temp, this.user[this.userId].id).subscribe((res: any) => {
        loading.dismiss();
        this.userItem = [];
        this.userId = -1;
        this.isDisplay = true;
        this.ocultar = true;
        this.cleanPost();
        this.log();
      });
      loading.dismiss();
    }).catch((err) => {
      console.log(err);
      loading.dismiss();
    })
  }

  async remove(id, index) {
    Swal.fire({
      title: '¿Deseas eliminar este registro?',
      backdrop: 'rgba(0,0,0,0.5)',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loading = await this.loadingController.create({
          message: 'Eliminando Tipo de fermentacion id: ' + id,
          spinner: 'crescent'
        });
        await loading.present().then(() => {
          this.restApiService.deleteListadoItem(this.tabla, id).subscribe((res: any) => {
            this.user.splice(index, 1);
            loading.dismiss();
          });
          loading.dismiss();
        }).catch((err) => {
          console.log(err);
          loading.dismiss();
        })
      }
    });
  }

  edit(item, id) {
    this.userItem = item;
    this.post = {
      muesta: item.muesta,
      fragancia: parseInt(item.fragancia),
      aroma: parseInt(item.aroma),
      sabor: parseInt(item.sabor),
      sabor_residual: parseInt(item.sabor_residual),
      acidez: parseInt(item.acidez),
      dulzor: parseInt(item.dulzor),
      boca: parseInt(item.boca),
      global: parseInt(item.global),
      defectos: item.defectos,
      tazas_defectousas: parseInt(item.tazas_defectousas),
      taza_no_uniformes: parseInt(item.taza_no_uniformes),
      total_scoree: parseFloat(item.total_scoree),
      id_lote: parseInt(item.id_lote)
    }
    this.userId = id;
    this.isDisplay = false
    this.ocultar = false
    this.calcularTotal();
  }

  calcularTotal() {
    //Math.round
    this.post.total_scoree = ((52.75 + ((this.post.fragancia + this.post.aroma + this.post.sabor + this.post.sabor_residual + this.post.acidez + this.post.dulzor + this.post.boca + this.post.global) * 0.65625)) - (2 * this.post.taza_no_uniformes) - (4 * this.post.tazas_defectousas));
    let numero = 0;
    numero = parseFloat(this.post.total_scoree.toFixed(2));
    let decimales = parseFloat((numero - (Math.trunc(numero))).toFixed(2));
    numero = (numero - decimales);
    this.entero = numero;
    if (decimales > 0.0 && decimales < 0.10) {
      decimales = 0.0;
    }
    if (decimales > 0.09 && decimales < 0.38) {
      decimales = 0.25;
    }
    if (decimales > 0.85) {
      decimales = 0;
      let x = numero;
      x = x + 1;
      numero = x;
    }
    if (decimales >= 0.38 && decimales < 0.60) {
      decimales = 0.50;
    }
    if (decimales >= 0.60 && decimales < 0.90) {
      decimales = 0.75;
    }
    this.entero = numero + decimales;
    this.post.total_scoree = this.entero;
    this.drawChart();
  }

  drawChart() {

    var data = null;
    data = new google.visualization.DataTable();

    data.addColumn({ type: 'string', 'id': 'key' });
    data.addColumn({ type: 'number', 'id': 'value' });
    data.addColumn({ type: 'number', 'id': 'category' });
    let aroma = 0
    aroma = ((this.post.fragancia) + (this.post.aroma)) / 2;
    let sabor = 0
    sabor = (this.post.sabor);
    let sabor_residual = 0
    sabor_residual = (this.post.sabor_residual);
    let acidez = 0
    acidez = (this.post.acidez);
    let dulzor = 0
    dulzor = (this.post.dulzor);
    let boca = 0
    boca = (this.post.boca);
    let global = 0
    global = (this.post.global);


    data.addRows([
      ["Fragancia/Aroma", aroma, 0],
      ["Sabor", sabor, 0],
      ["Sabor Residual", sabor_residual, 0],
      ["Acidez", acidez, 0],
      ["Dulzor", dulzor, 0],
      ["Sensación en Boca", boca, 0],
      ["Impresión Global", global, 0]
    ]);

    const options = {
      vega: {
        width: 350,
        height: 300,
        autosize: "none",
        title: {
          // text: 'Gráfica de la taza:',
        },
        signals: [
          { name: "radius", "update": "90" }
        ],
        data: [
          {
            name: "table",
            source: "datatable",
          },
          {
            name: "keys",
            source: "table",
            transform: [
              {
                type: "aggregate",
                groupby: ["key"]
              }
            ]
          }
        ],
        "scales": [
          {
            "name": "angular",
            "type": "point",
            "range": { "signal": "[-PI, PI]" },
            "padding": 0.5,
            "domain": { "data": "table", "field": "key" }
          },
          {
            "name": "radial",
            "type": "linear",
            "range": { "signal": "[0, radius]" },
            "zero": true,
            "nice": false,
            "domain": { "data": "table", "field": "value" },
            "domainMin": 0
          },
          {
            "name": "color",
            "type": "ordinal",
            "domain": { "data": "table", "field": "category" },
            "range": { "scheme": "category10" }
          }
        ],
        encode: {
          enter: {
            x: { signal: "width/2" },
            y: { signal: "height/2 + 20" }
          }
        },
        marks: [
          {
            type: "group",
            name: "categories",
            zindex: 1,
            from: {
              facet: { "data": "table", "name": "facet", "groupby": ["category"] }
            },
            "marks": [
              {
                "type": "line",
                "name": "category-line",
                "from": { "data": "facet" },
                "encode": {
                  "enter": {
                    "interpolate": { "value": "linear-closed" },
                    "x": { "signal": "scale('radial', datum.value) * cos(scale('angular', datum.key))" },
                    "y": { "signal": "scale('radial', datum.value) * sin(scale('angular', datum.key))" },
                    "stroke": { "scale": "color", "field": "category" },
                    "strokeWidth": { "value": 1 },
                    "fill": { "scale": "color", "field": "category" },
                    "fillOpacity": { "value": 0.1 }
                  }
                }
              },
              {
                "type": "text",
                "name": "value-text",
                "from": { "data": "category-line" },
                "encode": {
                  "enter": {
                    "x": { "signal": "datum.x" },
                    "y": { "signal": "datum.y" },
                    "text": { "signal": "datum.datum.value" },
                    "align": { "value": "center" },
                    "baseline": { "value": "middle" },
                    "fill": { "value": "black" }
                  }
                }
              }
            ]
          },
          {
            type: "rule",
            name: "radial-grid",
            from: { data: "keys" },
            zindex: 0,
            encode: {
              enter: {
                x: { value: 0 },
                y: { value: 0 },
                x2: { signal: "radius * cos(scale('angular', datum.key))" },
                y2: { signal: "radius * sin(scale('angular', datum.key))" },
                stroke: { value: "lightgray" },
                strokeWidth: { value: 1 }
              }
            }
          },
          {
            type: "text",
            name: "key-label",
            from: { "data": "keys" },
            zindex: 1,
            encode: {
              enter: {
                x: { signal: "(radius + 11) * cos(scale('angular', datum.key))" },
                y: [
                  {
                    test: "sin(scale('angular', datum.key)) > 0",
                    signal: "5 + (radius + 11) * sin(scale('angular', datum.key))"
                  },
                  {
                    test: "sin(scale('angular', datum.key)) < 0",
                    signal: "-5 + (radius + 11) * sin(scale('angular', datum.key))"
                  },
                  {
                    signal: "(radius + 11) * sin(scale('angular', datum.key))"
                  }
                ],
                text: { field: "key" },
                align:
                {
                  value: "center"
                },
                baseline: [
                  {
                    test: "scale('angular', datum.key) > 0", "value": "top"
                  },
                  {
                    test: "scale('angular', datum.key) == 0", "value": "middle"
                  },
                  {
                    value: "bottom"
                  }
                ],
                fill: { "value": "black" },
                fontSize: { "value": 12 }
              }
            }
          },
          {
            type: "line",
            name: "twenty-line",
            from: { data: "keys" },
            encode: {
              enter: {
                interpolate: { value: "linear-closed" },
                x: { signal: "0.2 * radius * cos(scale('angular', datum.key))" },
                y: { signal: "0.2 * radius * sin(scale('angular', datum.key))" },
                stroke: { value: "lightgray" },
                strokeWidth: { value: 1 }
              }
            }
          },
          {
            "type": "line",
            "name": "fourty-line",
            "from": { "data": "keys" },
            "encode": {
              "enter": {
                "interpolate": { "value": "linear-closed" },
                "x": { "signal": "0.4 * radius * cos(scale('angular', datum.key))" },
                "y": { "signal": "0.4 * radius * sin(scale('angular', datum.key))" },
                "stroke": { "value": "lightgray" },
                "strokeWidth": { "value": 1 }
              }
            }
          },
          {
            "type": "line",
            "name": "sixty-line",
            "from": { "data": "keys" },
            "encode": {
              "enter": {
                "interpolate": { "value": "linear-closed" },
                "x": { "signal": "0.6 * radius * cos(scale('angular', datum.key))" },
                "y": { "signal": "0.6 * radius * sin(scale('angular', datum.key))" },
                "stroke": { "value": "lightgray" },
                "strokeWidth": { "value": 1 }
              }
            }
          },
          {
            "type": "line",
            "name": "eighty-line",
            "from": { "data": "keys" },
            "encode": {
              "enter": {
                "interpolate": { "value": "linear-closed" },
                "x": { "signal": "0.8 * radius * cos(scale('angular', datum.key))" },
                "y": { "signal": "0.8 * radius * sin(scale('angular', datum.key))" },
                "stroke": { "value": "lightgray" },
                "strokeWidth": { "value": 1 }
              }
            }
          },
          {
            "type": "line",
            "name": "outer-line",
            "from": { "data": "radial-grid" },
            "encode": {
              "enter": {
                "interpolate": { "value": "linear-closed" },
                "x": { "field": "x2" },
                "y": { "field": "y2" },
                "stroke": { "value": "lightgray" },
                "strokeWidth": { "value": 1 }
              }
            }
          }
        ]
      }
    };

    var chart = new google.visualization.VegaChart(document.getElementById('lineas'));
    chart.draw(data, options);

  }
}
