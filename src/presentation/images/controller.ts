import { Response, Request } from "express";
import { CustomError } from "../../domain";
import fs from 'fs'
import path from 'path'

export class ImagesController {

	constructor() {}

	private handleError = ( error: unknown, res: Response ) => {
		if ( error instanceof CustomError ) {
			return res.status(error.statusCode).json({ error: error.message })
		}

		console.log(`${ error }`);
		return res.status(500).json({ error: 'Internal Server Error' })
	}

	getImage = ( req: Request, res: Response ) => {
		const { type = '', img = '' } = req.params;

		const imagePath = path.resolve( __dirname, `../../../upload/${ type }/${ img }` );

		console.log(imagePath);

		if ( !fs.existsSync( imagePath ) ) {
			return res.status(400).send('Image not found')
		}

		res.sendFile( imagePath );		
	}

}
