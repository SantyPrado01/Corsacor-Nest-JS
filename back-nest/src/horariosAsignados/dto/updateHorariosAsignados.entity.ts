import { PartialType } from '@nestjs/mapped-types';
import { CreateHorariosAsignadoDto } from './createHorariosAsignados.dto'; 
import { Empleado } from 'src/empleados/entities/empleado.entity';

export class UpdateHorariosAsignadoDto extends PartialType(CreateHorariosAsignadoDto) {

    horarioAsignadoId: number; 
 
    ordenTrabajoId: number;

    empleadoAsignadoId: number;

    empleadoSuplente?: Empleado; 

    fecha: String; 

    horaInicioProyectado: string;

    horaFinProyectado: string; 

    horaInicioReal?: string; 

    horaFinReal?: string; 

    estado?: string; 

    suplente?: boolean;

    comprobado: boolean

    observaciones?: string;
}