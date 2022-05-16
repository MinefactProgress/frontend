import * as jwt from 'jsonwebtoken';

export default jwt;
export function sign(payload: any, secret?: string, options?: jwt.SignOptions): string {
    return jwt.sign(payload, secret || "ShVmYq3t6w9z$C&E)H@McQfTjWnZr4u7", options);
}
export function verify(token: string, secret?: string, options?: jwt.VerifyOptions): any {
    return jwt.verify(token, secret || "ShVmYq3t6w9z$C&E)H@McQfTjWnZr4u7", options);
}