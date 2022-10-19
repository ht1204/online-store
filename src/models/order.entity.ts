import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn
} from "typeorm";

import { User } from './user.entity';
import { Item } from './item.entity';



@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    total: number;

    @CreateDateColumn()
    date: Date;

    @ManyToOne(() => User, (user) => user.orders) user: User;
    @OneToMany(() => Item, (item) => item.order) items: Item[];

    getId(): number {
        return this.id;
    }
    setId(id: number) {
        this.id = id;
    }
    getTotal(): number {
        return this.total;
    }
    setTotal(total: number) {
        this.total = total;
    }
    getDate(): Date {
        return this.date;
    }
    setDate(date: Date) {
        this.date = date;
    }

}