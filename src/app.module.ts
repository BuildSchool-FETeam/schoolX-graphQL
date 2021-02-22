import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/Auth.module';
import { HeartBeat as HeartBeatModule } from './HeartBeat/HeartBeat.module';
import { UserModule } from './user/user.module';

const graphQLModuleInit = GraphQLModule.forRoot({
  typePaths: ['./**/*.graphql'],
  installSubscriptionHandlers: true,
  definitions: {
    path: join(process.cwd(), 'src/graphql.ts'),
    outputAs: 'class',
    emitTypenameField: true,
  },
});

const typeORMModuleInit = TypeOrmModule.forRoot();

@Module({
  imports: [
    typeORMModuleInit,
    graphQLModuleInit,
    HeartBeatModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
