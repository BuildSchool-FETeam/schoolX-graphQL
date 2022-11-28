import { NestFactory } from '@nestjs/core'
import { graphqlUploadExpress } from 'graphql-upload'
import { AppModule } from './app.module'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(graphqlUploadExpress())
  await app.listen(3001)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(async () => app.close())
  }
}
bootstrap()
