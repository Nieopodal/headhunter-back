import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Injectable } from '@nestjs/common';
import {Admin} from "../admin/entity/admin.entity";
import {Hr} from "../hr/entity/hr.entity";
import {Student} from "../student/entity/student.entity";
import {configDb} from "./config";

@Injectable()
export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: configDb.dbHost,
      username: configDb.dbUser,
      password: configDb.dbPassword,
      database: configDb.dbDatabase,
      entities: [Admin, Hr, Student],
      autoLoadEntities: true,
      bigNumberStrings: false,
      logging: true,
      synchronize: true, // if true to create/update table in db.
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
