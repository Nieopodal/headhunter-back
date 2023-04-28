import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: this.configService.get('localhost'),
      // port: parseInt(this.configService.get('DB_PORT')),
      username: this.configService.get('wysonetw_apiHH'),
      password: this.configService.get('v5sjCGgH'),
      database: this.configService.get('wysonetw_apiHH'),
      entities: [this.configService.get('dist/**/*.entity.js')],
      autoLoadEntities: true,
      bigNumberStrings: false,
      logging: true,
      synchronize: true, // if true to create/update table in db.
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
