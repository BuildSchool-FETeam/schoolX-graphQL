import { TokenService } from './../services/token.service';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) { }

  canActivate (context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const headers = ctx.getContext().req.headers as DynamicObject;

    if (!headers.authorization) {
      return false;
    }

    const token = headers.authorization.split(' ')[1] as string;
    let isValidToken: boolean;

    try {
      this.tokenService.verifyAndDecodeToken(token)

      isValidToken = true;
    } catch (error) {
      isValidToken = false;
    }

    return isValidToken;
  }
}