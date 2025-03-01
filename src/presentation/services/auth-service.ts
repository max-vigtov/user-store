import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { UserModel } from '../../data';
import { bcryptAdapter } from '../../config';

export class AuthService {
	constructor() {}

	public async registerUser( registerUserDto: RegisterUserDto){

		const existUser = await UserModel.findOne({ email: registerUserDto.email });

		if ( existUser ) throw CustomError.badRequest('Email already exist');

		try {
			const user = new UserModel( registerUserDto);

			user.password = bcryptAdapter.hash(registerUserDto.password);

			await user.save();

			const { password, ...userEntity } =  UserEntity.fromObject( user );;

			return{ user: userEntity, token: 'ABC'};

		} catch (error) {
			throw CustomError.internalServer(`${ error }`)
		}
	}

	public async loginUser( loginUserDto: LoginUserDto){
	
		const existUser = await UserModel.findOne({ email: loginUserDto.email });

		if ( existUser ) {
			const isValidPassword = bcryptAdapter.compare(loginUserDto.password, existUser.password);

			if ( isValidPassword ) {
				const { password, ...userEntity } =  UserEntity.fromObject( existUser );
			
				return { user: userEntity, token: 'ABC' };
				
			} else {
				throw CustomError.badRequest('Invalid password');
			}
		} else throw CustomError.badRequest('Invalid email');
	}
}