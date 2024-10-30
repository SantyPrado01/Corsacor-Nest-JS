import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioAsignado } from './entities/horarios-asignado.entity'; 
import { CreateHorariosAsignadoDto } from './dto/create-horarios-asignado.dto';
import { OrdenTrabajo } from 'src/orden-trabajo/entities/orden-trabajo.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Injectable()
export class HorarioAsignadoService {
    constructor(
        @InjectRepository(HorarioAsignado)
        private readonly horarioAsignadoRepository: Repository<HorarioAsignado>,

        @InjectRepository(OrdenTrabajo)
        private readonly ordenTrabajoRepository: Repository<OrdenTrabajo>,

        @InjectRepository(Empleado)
        private readonly empleadoRepository: Repository<Empleado>,
    ) {}

    async create(createHorariosDto: CreateHorariosAsignadoDto) {
        const { ordenTrabajoId } = createHorariosDto;
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
            where: { ordenTrabajoId },
            relations: ['empleadoAsignado', 'necesidadHoraria'], 
        });
    
        if (!ordenTrabajo) {
            throw new Error('Orden de trabajo no encontrada');
        }
    
        const { anio, mes, necesidadHoraria, empleadoAsignado } = ordenTrabajo;
        const horariosAsignados = [];
    
        // Crear horarios según la necesidad horaria de cada día de la semana
        for (const necesidad of necesidadHoraria) {
            const fechas = this.obtenerFechasDelMes(anio, mes, necesidad.diaSemana);
    
            for (const fecha of fechas) {
                const horarioAsignado = this.horarioAsignadoRepository.create({
                    ordenTrabajo,
                    empleado: empleadoAsignado,
                    fecha: fecha,
                    horaInicioProyectado: necesidad.horaInicio,
                    horaFinProyectado: necesidad.horaFin,
                    estado: 'pendiente',
                    suplente: false,
                    empleadoSuplente: null,
                });
                horariosAsignados.push(horarioAsignado);
            }
        }

        await this.horarioAsignadoRepository.save(horariosAsignados);
        return horariosAsignados;
    }
    
    // Modificar `obtenerFechasDelMes` para recibir el día de la semana de `necesidadHoraria` y devolver las fechas correspondientes en el mes
    private obtenerFechasDelMes(anio: number, mes: number, diaSemana: number): Date[] {
        const fechas: Date[] = [];
        const primerDiaMes = new Date(anio, mes - 1, 1);
    
        // Iterar para encontrar todos los días del mes que coincidan con el índice del día de la semana
        for (let dia = primerDiaMes.getDate(); dia <= new Date(anio, mes, 0).getDate(); dia++) {
            const fecha = new Date(anio, mes - 1, dia);
            if (fecha.getDay() === diaSemana) {
                fechas.push(fecha);
            }
        }
    
        return fechas;
    }


    async findAll(): Promise<HorarioAsignado[]> {
        return await this.horarioAsignadoRepository.find({
            relations: ['ordenTrabajo', 'empleado', 'empleadoSuplente'], // Incluir relaciones si es necesario
        });
    }

    async findOne(id: number): Promise<HorarioAsignado> {
        const horarioAsignado = await this.horarioAsignadoRepository.findOne({
            where: { horarioAsignadoId: id },
            relations: ['ordenTrabajo', 'empleado', 'empleadoSuplente'],
        });

        if (!horarioAsignado) {
            throw new NotFoundException('Horario asignado no encontrado');
        }

        return horarioAsignado;
    }

    // Actualizar un horario asignado
    async update(id: number, updateData: Partial<CreateHorariosAsignadoDto>): Promise<HorarioAsignado> {
        await this.horarioAsignadoRepository.update(id, updateData);
        return this.findOne(id); // Devolver el horario actualizado
    }

    // Eliminar un horario asignado
    async remove(id: number): Promise<void> {
        const result = await this.horarioAsignadoRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Horario asignado no encontrado');
        }
    }
}
