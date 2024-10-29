import { Repository } from 'typeorm';
import { HorarioAsignado } from './entities/horarios-asignado.entity';
import { CreateHorariosAsignadoDto } from './dto/create-horarios-asignado.dto';
import { OrdenTrabajo } from 'src/orden-trabajo/entities/orden-trabajo.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
export declare class HorarioAsignadoService {
    private readonly horarioAsignadoRepository;
    private readonly ordenTrabajoRepository;
    private readonly empleadoRepository;
    constructor(horarioAsignadoRepository: Repository<HorarioAsignado>, ordenTrabajoRepository: Repository<OrdenTrabajo>, empleadoRepository: Repository<Empleado>);
    create(createHorariosDto: CreateHorariosAsignadoDto): Promise<any[]>;
    private obtenerFechasDelMes;
    findAll(): Promise<HorarioAsignado[]>;
    findOne(id: number): Promise<HorarioAsignado>;
    update(id: number, updateData: Partial<CreateHorariosAsignadoDto>): Promise<HorarioAsignado>;
    remove(id: number): Promise<void>;
}
