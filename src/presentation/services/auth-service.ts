import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { UserModel } from '../../data';
import { bcryptAdapter, envs, JwtAdapter } from '../../config';
import { EmailService } from './email-service';

export class AuthService {
	constructor(
		private readonly emailService: EmailService
	) {}

	public async registerUser( registerUserDto: RegisterUserDto){

		const existUser = await UserModel.findOne({ email: registerUserDto.email });

		if ( existUser ) throw CustomError.badRequest('Email already exist');

		try {
			const user = new UserModel( registerUserDto );

			//Password encryption
			user.password = bcryptAdapter.hash(registerUserDto.password);

			await user.save();

			//Sending Email confirmation
			await this.sendEmailValidationLink( user.email );

			const { password, ...userEntity } =  UserEntity.fromObject( user );

			return{ user: userEntity };

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
			
				const token = await JwtAdapter.generateToken({ id: userEntity.id });

				if ( !token ) CustomError.internalServer('Error while creating token');

				return { user: userEntity, token: token };
				
			} else {
				throw CustomError.badRequest('Invalid password');
			}
		} else throw CustomError.badRequest('Invalid email');
	}

	private sendEmailValidationLink = async( email: string ) => {

		const token = await JwtAdapter.generateToken({ email });
		if( !token ) throw CustomError.internalServer('Error getting token');

		const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
		const html = `
			<h1>Validate your email</h1>
			<p>Click in the link below to validate your email</p>
			<a href=${link}>Validate your email: ${email}</a>
		`
		const options = {
			to: email,
			subject: 'Validate your email',
			htmlBody: html
		}

		const inSet = await this.emailService.sendEmail( options );
		if( !inSet ) throw CustomError.internalServer('Error sending email');

		return true;
	}

	public validateEmail = async( token: string ) =>{
		
		const payload = await JwtAdapter.validateToken( token );
		
		if ( !payload ) throw CustomError.unauthorized('Invalid token');

		const { email } = payload as { email: string };
		if ( !email ) throw CustomError.internalServer('Email not in token');

		const user = await UserModel.findOne({ email });
		if ( !user ) throw CustomError.internalServer('Email not exists');

		user.emailValidated = true;
		await user.save();

		return true;
	}
}