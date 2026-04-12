import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user: object;
        }
    }
}
import { JwtTokenService } from '../services/jwt-token.service';
import { EncryptService } from '../services/encrypt.service';
export declare class AuthMiddleware implements NestMiddleware {
    private request;
    protected readonly jwtTokenService: JwtTokenService;
    protected readonly encryptService: EncryptService;
    constructor(request: Request, jwtTokenService: JwtTokenService, encryptService: EncryptService);
    private readonly log;
    use(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=auth.middleware.d.ts.map