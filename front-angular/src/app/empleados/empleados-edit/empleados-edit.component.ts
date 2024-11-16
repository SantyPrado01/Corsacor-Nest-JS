import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoriaEmpleadoService } from '../services/categoria-empleado.service'; 
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';

@Component({
  selector: 'app-edit-empleado',
  standalone: true,
  templateUrl: './empleados-edit.component.html',
  imports:[NabvarComponent, FormsModule, CommonModule],
  styleUrls: ['./empleados-edit.component.css']
})
export class EditEmpleadoComponent implements OnInit {

  seccionActual: string = 'datosPersonales';
  empleado: any = {};
  categorias: any[] = [];
  ciudades: any[] = [];
  provinciaCórdobaId = 14;
  ciudadNombre: string = '';
  contadorCaracteres: number = 0;
  empleadoId: string | null = null;

  disponibilidad = [
    { disponibilidadHorariaId:null, diaSemana: 1, nombre: 'Lunes', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 2, nombre: 'Martes', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 3, nombre: 'Miércoles', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 4, nombre: 'Jueves', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 5, nombre: 'Viernes', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 6, nombre: 'Sábado', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 7, nombre: 'Domingo', horaInicio: '', horaFin: '' }
  ];

  fullTime: boolean = false;

  constructor(
    private http: HttpClient, 
    private categoriaEmpleadoService: CategoriaEmpleadoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog  
  ) {}

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

  actualizarContador(event: Event) {
    const inputElement = event.target as HTMLTextAreaElement;
    this.contadorCaracteres = inputElement.value.length;
  }

  validarTelefono(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.empleado.telefono = input.value;
  }

  validarSoloLetras(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^a-zA-Z ]/g, '');
  }

  mostrarSeccion(seccion: string): void {
    this.seccionActual = seccion;
  }

  ngOnInit() {
    this.categoriaEmpleadoService.getCategoriasEmpleados().subscribe({
      next: (data) => {
        console.log('Categorías obtenidas:', data);
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
      }
    });
    this.empleadoId = this.route.snapshot.paramMap.get('id');
    if (this.empleadoId){
      this.cargarEmpleado(this.empleadoId)
    }
  }

  toggleFullTime() {
    if (this.fullTime) {
      this.disponibilidad.forEach(dia => {
        dia.horaInicio = '';
        dia.horaFin = '';
      });
    }
  }

  cargarEmpleado(empleadoId: string) {
    this.http.get<any>(`http://localhost:3000/empleados/${empleadoId}`).subscribe({
      next: (data) => {
        this.empleado = data;
        const categoriaSeleccionada = this.categorias.find(c => c.id === this.empleado.categoria.id);
        if (categoriaSeleccionada) {
          this.empleado.categoria = categoriaSeleccionada.nombre;
        }
        this.disponibilidad.forEach(dia => {
          const disp = this.empleado.disponibilidades?.find((d: any) => d.diaSemana === dia.diaSemana);
          if (disp) {
            dia.disponibilidadHorariaId = disp.disponibilidadHorariaId;
            dia.horaInicio = this.formatearHora(disp.horaInicio);
            dia.horaFin = this.formatearHora(disp.horaFin);
            console.log('Esta es la disponibilidad:',disp)
          } else {
            dia.horaInicio = '';
            dia.horaFin = '';
          }
        });
        if (this.empleado.ciudad) {
          this.obtenerNombreCiudad(this.empleado.ciudad.toString()).subscribe({
            next: (response) => {
              this.ciudadNombre = response.localidades_censales?.[0]?.nombre ?? 'Desconocido';
            },
            error: (err) => {
              console.error('Error al obtener el nombre de la ciudad', err);
              this.ciudadNombre = 'Error';
            }
          });
        } else {
          this.ciudadNombre = 'Desconocido';
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos del empleado', err);
      }
    });
  }
  
  obtenerNombreCiudad(idCiudad: string) {
    const url = `https://apis.datos.gob.ar/georef/api/localidades-censales?id=${idCiudad}&aplanar=true&campos=nombre&exacto=true`;
    return this.http.get<any>(url);
  }

  seleccionarCiudad(event: any) {
    const selectedCity = this.ciudades.find(c => c.nombre === event.target.value);
    if (selectedCity) {
      this.empleado.ciudad = selectedCity.id;
      this.ciudadNombre = selectedCity.nombre;
    }
  }

  actualizarEmpleado() {
    const empleadoId = this.route.snapshot.paramMap.get('id');
    if (empleadoId) {
      // Aquí estructuramos el objeto que vamos a enviar al backend
      const empleadoActualizado = {
        ...this.empleado, // Mantén los campos del empleado
        disponibilidades: this.disponibilidad, 
      };
      
      console.log('Empleado actualizado', empleadoActualizado);
      this.http.patch<any>(`http://localhost:3000/empleados/${empleadoId}`, empleadoActualizado).subscribe({
        next: (response) => {
          console.log('Empleado y Disponibilidad actualizados con éxito:', response);
          this.mostrarAlerta('Operación Exitosa', 'Empleado y Disponibilidad actualizados con éxito.', 'success');
          this.router.navigate(['/employee']);
        },
        error: (err) => {
          console.error('Error al actualizar el empleado y disponibilidad:', err);
          this.mostrarAlerta('Error Operación', 'Error al guardar el empleado o disponibilidad.', 'error');
        }
      });
    }
  }

  buscarCiudad(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value;
    if (query.length > 2) {
      const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId}&nombre=${query}&max=10`;

      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.ciudades = response.localidades.map((localidad: any) => ({
            id: localidad.id,
            nombre: localidad.nombre,
          }));
        },
        error: (err) => {
          console.error('Error al obtener las ciudades', err);
          this.ciudades = [];
        }
      });
    } else {
      this.ciudades = [];
    }
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    const [horaParte, minutosParte] = hora.split(':');
    return `${horaParte}:${minutosParte}`;
  }

  cancelar() {
    alert('Empleado NO actualizado, operación cancelada.');
    this.mostrarAlerta('Operacion Cancelada', 'Empleado NO actualizado.', 'success');
    this.router.navigate(['/employee']);
  }
}
