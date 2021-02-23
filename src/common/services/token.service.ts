import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class TokenService {
  private readonly privateKey = 'Yasuoganktem20gg'
  private readonly expirationTime = '8h'

  createToken (data: any) {
    const token = jwt.sign(
      data,
      this.privateKey,
      {
        expiresIn: this.expirationTime
      }
    )

    return token;
  }

  verifyAndDecodeToken (token: string) {
    try {
      const decodedData = jwt.verify(token, this.privateKey);

      return decodedData
    } catch (err) {
      throw new Error(err)
    }
  }
}