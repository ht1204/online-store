import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { ProductsService } from './models/products.service'; 
import { Product } from './models/product.entity';
import { AdminModule } from './admin/admin.module';
import { UsersService } from './models/users.service';
import { User } from './models/user.entity';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [
   ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
        useFactory: () => ({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT) || 3306,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: ["dist/**/*.entity{.ts,.js}"],
          synchronize: true
        })
      }),
    TypeOrmModule.forFeature([Product, User]),
    AdminModule,
    AuthModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [ProductsService, UsersService],
  exports: [ProductsService, UsersService],
})
export class AppModule {}
