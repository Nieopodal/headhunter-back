import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Injectable } from '@nestjs/common';
import {Student} from "../student/entity/student.entity";
import {Admin} from "../admin/entity/admin.entity";
import {Hr} from "../hr/entity/hr.entity";

@Injectable()
export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: this.configService.get('DB_HOST'),
      port: parseInt(this.configService.get('DB_PORT')),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [Admin, Hr, Student],
      autoLoadEntities: true,
      bigNumberStrings: false,
      logging: true,
      synchronize: true, // if true to create/update table in db.
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
