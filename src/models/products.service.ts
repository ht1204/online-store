import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    findAll(): Promise<Product[]> {
        return this.productsRepository.find();
    }

    findByIds(productIds: string[]): Promise<Product[]> { 
        return this.productsRepository.findBy({
            id: In(productIds),
        });
    }

    findOne(id: number): Promise<Product> {
        return this.productsRepository.findOne({
            where: {
                id,
            },
        });
    }

    createOrUpdate(product: Product): Promise<Product> { 
        return this.productsRepository.save(product);
    }

    async remove(id: number): Promise<void> { 
       await this.productsRepository.delete(id);
    }

}