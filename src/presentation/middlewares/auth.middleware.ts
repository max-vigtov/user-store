import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from '../../config/jwt.adapter';
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {

	static async validateJWT( req: Request, res: Response, next: NextFunction ){
		const authorization = req.header('Authorization');

		if(!authorization) return res.status(401).json({ message: 'No token provided'});

		if ( !authorization.startsWith('Bearer') ) return res.status(401).json({ error: 'Invalid Bearer Token' });

		const token = authorization.split(' ').at(1) || '';

		try {
			const payload = await JwtAdapter.validateToken<{ id: string }>( token );
			if ( !payload ) return res.status(401).json({ error: 'Invalid token'});
			
			const user = await UserModel.findById( payload.id );
			if ( !user ) return res.status(401).json({ error: 'Invalid token - user'})
			
			req.body.user = UserEntity.fromObject(user);

			next();

		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server error'})
		}
	}
}
