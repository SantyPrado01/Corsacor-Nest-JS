import { OrdenTrabajo } from "../../orden-trabajo/entities/orden-trabajo.entity";
import { CategoriaServicio } from "../../categoria-servicio/entities/categoria-servicio.entity";
import { Factura } from "../../facturas/entities/factura.entity";
import { NecesidadHoraria } from "../../necesidad-horaria/entities/necesidad-horaria.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name:'Servicios'
})

export class Servicio {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    servicioId:number

    @Column()
    nombre:string

    @Column()
    cuit: string

    @Column()
    direccion: string

    @Column()
    ciudad: number;

    @Column()
    telefono: string;

    @ManyToOne(()=> CategoriaServicio, categoria => categoria.servicios)
    categoria: CategoriaServicio[];

    @Column()
    descripcion: string

    @Column({default:false})
    eliminado: boolean

    @OneToMany(() => Factura, factura => factura.servicio)
    facturas: Factura[];

    @OneToMany(() => OrdenTrabajo, (ordenTrabajo) => ordenTrabajo.servicio)
    ordenesTrabajo: OrdenTrabajo[];

}

