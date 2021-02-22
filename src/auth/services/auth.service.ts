import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  private readonly privateKey = 'Yasuoganktem20gg'
  private readonly expirationTime = 2 * 15

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