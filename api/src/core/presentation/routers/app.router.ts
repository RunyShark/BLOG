import { Router } from 'express';
import { AuthRouter } from './auth';
import { WebRouter } from './web';
import { AuthController } from './auth/auth.controller';
import { WebController } from './web/web.controller';
import { AuthService } from './auth/auth.service';
import { WebService } from './web/web.service';
import {
  AuthRepositoryImpl,
  BlogRepositoryImpl,
} from '@infrastructure/repositories';
import { AuthDataSourcePostgres } from '@infrastructure/datasources/auth';
import { prisma } from '../../../common/config/db/prisma.service';
import { BlogDataSourcePostgres } from '@infrastructure/datasources/web/blog.datasource.postgres';

export enum ValidRoutes {
  auth = 'auth',
  web = 'web',
}

interface configRouter {
  apiPrefix?: string;
  apiV?: string;
}

export class AppRoutes {
  private readonly apiV: string = 'v1';
  private readonly apiPrefix: string = 'v1';

  constructor(
    private readonly router: Router,
    private readonly db: typeof prisma,
    { apiV = 'v1', apiPrefix = 'api' }: configRouter
  ) {
    this.apiV = apiV;
    this.apiPrefix = apiPrefix;
  }

  get routes(): Router {
    const baseApi = `/${this.apiPrefix}/${this.apiV}/`;

    const authRouter = new AuthRouter(
      this.router,
      new AuthController(
        new AuthService(
          new AuthRepositoryImpl(new AuthDataSourcePostgres(this.db))
        )
      )
    ).routes;

    const webRouter = new WebRouter(
      this.router,
      new WebController(
        new WebService(
          new BlogRepositoryImpl(new BlogDataSourcePostgres(this.db))
        )
      )
    ).routes;

    this.router.use(`${baseApi}${ValidRoutes.auth}`, authRouter);
    this.router.use(`${baseApi}${ValidRoutes.web}`, webRouter);

    return this.router;
  }
}
