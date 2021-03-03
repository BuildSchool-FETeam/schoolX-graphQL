import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/Auth.module';
import { HeartBeat as HeartBeatModule } from './HeartBeat/HeartBeat.module';
import { PermissionModule } from './permission/permission.module';
import { AdminUserModule } from './AdminUser/AdminUser.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './common/guards/permission.guard';
import { CommonModule } from './common/Common.module';
import { PermissionSet } from './permission/entities/Permission.entity';
import { AdminUser } from './AdminUser/AdminUser.entity';
import { Role } from './permission/entities/Role.entity';
import { Lesson } from './courses/entities/Lesson.entity';
import { LessonDocument } from './courses/entities/LessonDocument.entity';

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
  },
  fieldResolverEnhancers: ['guards'],
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
    CommonModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
