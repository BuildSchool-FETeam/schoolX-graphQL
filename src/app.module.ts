import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/Auth.module';
import { HeartBeat as HeartBeatModule } from './HeartBeat/HeartBeat.module';
import { PermissionModule } from './permission/permission.module';
import { AdminUserModule } from './AdminUser/AdminUser.module';

const graphQLModuleInit = GraphQLModule.forRoot({
  typePaths: ['./**/*.graphql'],
  installSubscriptionHandlers: true,
  definitions: {
    path: join(process.cwd(), 'src/graphql.ts'),
    outputAs: 'class',
    emitTypenameField: true,
  },
  cors: {
    origin: 'http://localhost:3000',
  }
});

const typeORMModuleInit = TypeOrmModule.forRoot();

@Module({
  imports: [
    typeORMModuleInit,
    graphQLModuleInit,
    HeartBeatModule,
    AuthModule,
    AdminUserModule,
    PermissionModule,
  ],
})
export class AppModule { }
