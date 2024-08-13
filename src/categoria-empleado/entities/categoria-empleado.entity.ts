import { Empleado } from "src/empleados/entities/empleado.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'categoriaEmpleado'
})

export class CategoriaEmpleado {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    categoriaEmpleadoId:number

    @Column()
    categoriaEmpleadoNombre: string

    @Column({default: false})
    eliminado: boolean;

    @OneToMany(()=> Empleado, empleado => empleado.categorias)
    empleados: Empleado

}
