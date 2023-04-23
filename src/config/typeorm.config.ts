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
      host: this.configService.get('DB_HOST'),
      port: parseInt(this.configService.get('DB_PORT')),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [this.configService.get('TYPEORM_ENTITIES')],
      autoLoadEntities: true,
      bigNumberStrings: false,
      logging: true,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
      extra: {
        connectionLimit: 5,
      },
      connectTimeout: 30000,
    };
  }
}
