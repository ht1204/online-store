import { Controller, Get, Render, Param, Res } from '@nestjs/common';
import { ProductsService } from './models/products.service';

@Controller('/products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Get('/')
    @Render('products/index')
    async index() {
        const viewData = [];
        viewData['title'] = 'Products - Online Store';
        viewData['subtitle'] = 'List of products';
        viewData['product'] = await this.productsService.findAll();
        return {
            viewData,
        };
    }

    @Get('/:id')
    async show(@Param() params, @Res() response){
        const { id } = params;
        const product = await this.productsService.findOne(id);
        
        if (!product) return response.redirect('/products'); 

        const viewData = [];
        viewData['title'] = [product.getName(),' - Online Store'].join('');
        viewData['subtitle'] = [product.getName(),' -List of products'].join('');
        viewData['product'] = product;

        return response.render('products/show', { viewData });
    }

}