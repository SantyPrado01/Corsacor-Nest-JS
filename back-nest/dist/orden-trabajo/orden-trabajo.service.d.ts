import { Repository } from 'typeorm';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';
export declare class OrdenTrabajoService {
    private readonly ordenTrabajoRepository;
    private readonly empleadoRepository;
    private readonly servicioRepository;
    constructor(ordenTrabajoRepository: Repository<OrdenTrabajo>, empleadoRepository: Repository<Empleado>, servicioRepository: Repository<Servicio>);
    create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    findAll(): Promise<OrdenTrabajo[]>;
    findOne(id: number): Promise<OrdenTrabajo>;
    update(id: number, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    remove(id: number): Promise<void>;
}
