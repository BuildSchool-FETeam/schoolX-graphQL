import { ScheduleModule } from '@nestjs/schedule'
import { CacheModule, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { join } from 'path'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ArticleModule } from 'src/article/article.module'
import { GraphQLUpload } from 'graphql-upload'
import { CourseModule } from './courses/Course.module'
import { AuthModule } from './auth/Auth.module'
import { HeartBeat as HeartBeatModule } from './HeartBeat/HeartBeat.module'
import { PermissionModule } from './permission/permission.module'
import { AdminUserModule } from './adminUser/AdminUser.module'
import { PermissionGuard } from './common/guards/permission.guard'
import { CommonModule } from './common/Common.module'
import { TagModule } from './tag/tag.module'
import { InstructorModule } from './instructor/instructor.module'
import { AssignmentModule } from './assignment/assignment.module'
import { NotificationModule } from './notification/notification.module'
import { ClientUserModule } from './clientUser/clientUser.module'
import { EmailModule } from './Email/email.module'
import { MiniServerModule } from './mini-server/mini-server.module'
import { CommentModule } from './comment/comment.module'

const EnvInitModule = ConfigModule.forRoot({
  envFilePath: ['.env.development', '.env'],
  isGlobal: true,
})

import { typeORMModuleInit } from './database.module'

const cacheManagerModule = CacheModule.register({
  ttl: 1000, // 1000s
  max: 100,
})

console.log(process.env.CORS)

const graphQLModuleInit = GraphQLModule.forRoot({
  driver: ApolloDriver,
  typePaths: ['./**/*.graphql'],
  installSubscriptionHandlers: true,
  definitions: {
    path: join(process.cwd(), 'src/graphql.ts'),
    outputAs: 'class',
    emitTypenameField: true,
  },
  cors: {
    origin: process.env.CORS,
  },
  fieldResolverEnhancers: ['guards'],
  subscriptions: {
    'graphql-ws': true,
  },
  resolvers: {
    Upload: GraphQLUpload,
  },
})

const scheduleModule = ScheduleModule.forRoot()

@Module({
  imports: [
    scheduleModule,
    typeORMModuleInit,
    graphQLModuleInit,
    cacheManagerModule,
    HeartBeatModule,
    AuthModule,
    AdminUserModule,
    PermissionModule,
    CommonModule,
    InstructorModule,
    CourseModule,
    EnvInitModule,
    TagModule,
    AssignmentModule,
    NotificationModule,
    ClientUserModule,
    EmailModule,
    ArticleModule,
    MiniServerModule,
    CommentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
