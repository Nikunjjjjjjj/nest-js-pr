// NPM modules
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Config } from 'src/configs';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async register(): Promise<any> {
    return true;
  }
  /**
   *
   * @param password
   * @param passwordHash
   * @returns
   */
  compareUserPassword(password: any, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
  /**
   * @param password
   * @returns
   */
  generateUserPassword(password: any): any {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }
  /**
   * @param payload
   * @returns
   */
  generateJWTToken(payload: any,  secret: string = process.env.JWT_SECRET): any {
    if (secret) {
      return `Bearer ${this.jwtService.sign(payload, { secret })}`;
    }
    return `Bearer ${this.jwtService.sign(payload)}`;
  }
  /**
   * @param authToken string
   * @returns
   */
  decodeAuthToken(authToken: string): any {
    const authTokenArray = authToken.split(' ');
    if (authTokenArray.length > 1) {
      const tokenPayload = this.jwtService.decode(authTokenArray[1]);
      return { token: authTokenArray[1], tokenPayload, fullToken: authToken };
    }
    const tokenPayload = this.jwtService.decode(authToken);
    return { token: authToken, tokenPayload, fullToken: authToken };
  }
  /**
   * @param authToken string
   * @returns
   */
  verifyAuthToken(authToken: string, secret: string = null): any {
    secret = '441d892774517225be5717fd814cec577f87cd7be9e25bde3f7028fcb5a209547cbc4076f812de1e2b2f6b51c82f6e2dd2c70e9514f8ab353915def8ded4dfa037c080b5bef358a2db164370d7fe3313fb1f0c97aafd800db2949c9d93892b9dd2b2ca11bbb1a579602d30bd42df9689dedafe48c730f485c12f015deb983289921e1fd4e6b696fb3ff7eddc8a3ca68bda55bd5a8deb0557f59b5d419a1f4352d81266df2baf31d3d092554d5709fb00ff57c87052bfc42b9d90a9bbfc10db9a410c1a30e0e893b7f9ed46540241429c5dd1e300289ac52bdc4163c6dfe86d2849aabcbf4570b8007873dc42b88a7d69eaa67be8f151448e1690c00f6213a8b0'
    const authTokenArray = authToken.split(' ');
    console.log(secret,'secret');
    if (authTokenArray.length > 1) {
      if (secret) {
        return this.jwtService.verify(authTokenArray[1], { secret });
      }
      return this.jwtService.verify(authTokenArray[1]);
    }
    if (secret) {
      return this.jwtService.verify(authToken, { secret });
    }
    return this.jwtService.verify(authToken);
  }
}
