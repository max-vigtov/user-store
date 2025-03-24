import path from 'path';
import { UploadedFile } from "express-fileupload";
import fs from 'fs';
import { Uuid } from '../../config';
import { CustomError } from '../../domain';

export class FileUploadService {
	constructor(
		private readonly uuid = Uuid.v4
	) {}

	private checkFolder( folderPath: string ){
		if ( !fs.existsSync( folderPath ) ) {
			fs.mkdirSync( folderPath )
		}
	}
	async uploadSingle( 
		file: UploadedFile, 
		folder: string = 'upload', 
		validExtensions: string[] = ['.jpg', '.png', '.jpeg', '.gif', '.JPEG'] )
	{
		try {
			const fileExtension = file.mimetype.split('/').at(1) ?? '';

			if ( !validExtensions.includes( `.${fileExtension}` ) ) {
				throw CustomError.badRequest(`Invalid file extension '${ fileExtension }', valid ones:${ validExtensions }`);				
			}

			const destination = path.resolve( __dirname, '../../../', folder );
			this.checkFolder( destination );

			const fileName = `${ this.uuid() }.${ fileExtension}`;

			file.mv( `${ destination }/${ fileName }`);

			return {
				ok: true,
				FileName: fileName
			}
		} catch (error) {
			throw error;
		}
	}

	async uploadMultiple( 
		files: UploadedFile[], 
		folder: string = 'upload', 
		validExtensions: string[] = [ '.jpg', '.png', '.jpeg', '.gif' ] )
	{
		const fileNames = await Promise.all(
			files.map( file => this.uploadSingle( file, folder, validExtensions))
		)

		return fileNames;
	}

}