"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NecesidadHorariaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const necesidad_horaria_entity_1 = require("./entities/necesidad-horaria.entity");
const typeorm_2 = require("typeorm");
const orden_trabajo_service_1 = require("../orden-trabajo/orden-trabajo.service");
let NecesidadHorariaService = class NecesidadHorariaService {
    constructor(necesidadHorariaRepository, ordenTrabajoService) {
        this.necesidadHorariaRepository = necesidadHorariaRepository;
        this.ordenTrabajoService = ordenTrabajoService;
    }
    async create(createNecesidadHorariaDto) {
        const ordenesTrabajo = await this.ordenTrabajoService.findOne(createNecesidadHorariaDto.ordenTrabajoId);
        if (!ordenesTrabajo) {
            throw new common_1.NotFoundException(`Orden de Trabajo con ID ${createNecesidadHorariaDto.ordenTrabajoId} no encontrado`);
        }
        const nuevaNecesidad = this.necesidadHorariaRepository.create({
            ...createNecesidadHorariaDto,
            ordenTrabajo: ordenesTrabajo,
        });
        console.log(nuevaNecesidad);
        return this.necesidadHorariaRepository.save(nuevaNecesidad);
    }
    async findAll() {
        return this.necesidadHorariaRepository.find({ relations: ['ordenTrabajo'] });
    }
    async findOne(id) {
        const necesidad = await this.necesidadHorariaRepository.findOne({
            where: { necesidadHorariaId: id },
            relations: ['ordenTrabajo'],
        });
        if (!necesidad) {
            throw new common_1.NotFoundException(`Necesidad horaria con ID ${id} no encontrada`);
        }
        return necesidad;
    }
    async update(id, updateNecesidadHorariaDto) {
        const necesidad = await this.necesidadHorariaRepository.preload({
            necesidadHorariaId: id,
            ...updateNecesidadHorariaDto,
        });
        if (!necesidad) {
            throw new common_1.NotFoundException(`Necesidad horaria con ID ${id} no encontrada`);
        }
        return this.necesidadHorariaRepository.save(necesidad);
    }
    async remove(id) {
        const result = await this.necesidadHorariaRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Necesidda horaria con ID ${id} no encontrada`);
        }
    }
};
exports.NecesidadHorariaService = NecesidadHorariaService;
exports.NecesidadHorariaService = NecesidadHorariaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(necesidad_horaria_entity_1.NecesidadHoraria)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        orden_trabajo_service_1.OrdenTrabajoService])
], NecesidadHorariaService);
//# sourceMappingURL=necesidad-horaria.service.js.map