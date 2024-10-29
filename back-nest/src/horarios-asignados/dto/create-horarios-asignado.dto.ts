import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Empleado } from "src/empleados/entities/empleado.entity";
import { OrdenTrabajo } from "src/orden-trabajo/entities/orden-trabajo.entity";
import { PrimaryGeneratedColumn } from "typeorm";

export class CreateHorariosAsignadoDto {
    horarioAsignadoId: number; 
 
    ordenTrabajoId: number;

    empleadoAsignadoId: number;

    empleadoSuplente?: Empleado; 

    fecha: String; 

    horaInicioProyectado: string;

    horaFinProyectado: string; // Hora de fin proyectado

    horaInicioReal?: string; // Hora de inicio real (opcional)

    horaFinReal?: string; // Hora de fin real (opcional)

    estado?: string; // Estado del horario asignado (opcional)

    suplente?: boolean;

}
