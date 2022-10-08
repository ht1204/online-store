import { 
    Controller, 
    Get,
    Render, 
    Post, 
    Body,
    Redirect,
    UseInterceptors,
    UploadedFile,
    Param,
    Req,
    Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from '../models/products.service';
import { Product } from '../models/product.entity';
import { ProductValidator } from '../validators/product.validator';
import fs from 'fs';


@Controller('/admin/products')
export class AdminProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get('/')
    @Render('admin/products/index')
    async index() {
        const viewData = [];
        viewData['title'] = 'Admin Page - Admin - Online Store';
        viewData['products'] = await this.productsService.findAll();

        return {
            viewData,
        };
    }

    @Post('/store')
    @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' })) 
    @Redirect('/admin/products') 
    async store(@Body() body, @UploadedFile() file: Express.Multer.File, @Req() request) {

        const toValidate: string[] = ['name', 'description', 'price', 'imageCreate']; 
        const errors: string[] = ProductValidator.validate(body, file, toValidate);

        if(!errors.length) {
            const { name, description, price } = body;
            const newProduct = new Product(); 
            newProduct.setName(name); 
            newProduct.setDescription(description);
            newProduct.setPrice(price); 
            newProduct.setImage(file.filename);
            await this.productsService.createOrUpdate(newProduct);
        } else {
            if (file) fs.unlinkSync(file.path);
            request.session.flashErrors = errors;
        }

    }

    @Post('/:id') 
    @Redirect('/admin/products') 
    remove(@Param('id') id: number) {
        return this.productsService.remove(id); 
    }


    @Get('/:id') 
    @Render('admin/products/edit')
    async edit(@Param('id') id: number) {
        const viewData = [];
        viewData['title'] = 'Admin Page - Edit Product - Online Store'; 
        viewData['product'] = await this.productsService.findOne(id); 
        return {
            viewData, 
        };
    }

    @Post('/:id/update')
    @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' })) 
    async update(@Body() body,
                 @UploadedFile() file: Express.Multer.File, 
                 @Param('id') id: number,
                 @Req() request,
                 @Res() response,
        ){

        const toValidate: string[] = ['name', 'description', 'price', 'imageUpdate']; 
        const errors: string[] = ProductValidator.validate(body, file, toValidate);
        console.log('errors: ', errors);

        if(!errors.length) {
            const product = await this.productsService.findOne(id); 
            const { name, description, price } = body;
    
            product.setName(name); 
            product.setDescription(description); 
            product.setPrice(price);
            
            if (file) product.setImage(file.filename); 
            
            await this.productsService.createOrUpdate(product);
            return response.redirect('/admin/products/');

        } else {

            if (file) fs.unlinkSync(file.path);
            request.session.flashErrors = errors;
            const productURL = ['/admin/products/', id].join('');
            return response.redirect(productURL);

        }

    }
}