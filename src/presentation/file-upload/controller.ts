import { Response, Request } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services";
import { UploadedFile } from "express-fileupload";

export class FileUploadController {

	constructor(
		private readonly fileleUploadService: FileUploadService
	) {}

	private handleError = ( error: unknown, res: Response ) => {
		if ( error instanceof CustomError ) {
			return res.status(error.statusCode).json({ error: error.message })
		}

		console.log(`${ error }`);
		return res.status(500).json({ error: 'Internal Server Error' })
	}

	uploadFile = ( req: Request, res: Response ) => {

		const type = req.params.type;

		const file = req.body.files.at(0) as UploadedFile;

		this.fileleUploadService.uploadSingle( file, `upload/${ type }`)
			.then( uploaded => res.json( uploaded ))
			.catch( error => this.handleError( error, res ))
	}

	uploadMultipleFile = ( req: Request, res: Response ) => {
		
		const type = req.params.type;

		const files = req.body.files as UploadedFile[];		

		this.fileleUploadService.uploadMultiple( files, `upload/${ type }`)
			.then( uploaded => res.json( uploaded ))
			.catch( error => this.handleError( error, res ))
	}
}
