import { Router } from "express";
import { FileUploadController } from './controller';
import { FileUploadService } from "../services";
import { FileUploadMiddlware } from "../middlewares/file-upload.middleware";
import { TypeMiddlware } from "../middlewares/type.middleware";

export class FileUploadRoutes {

  static get routes(): Router {

	const router = Router();
	
	const fileUploadService = new FileUploadService();
	const controller = new FileUploadController( fileUploadService );
	
	//Middlewares
	router.use( FileUploadMiddlware.containFiles );
	router.use( TypeMiddlware.validTypes( [ 'users', 'products', 'categories' ] ) );
	
	// Definir las rutas
	router.post('/single/:type', controller.uploadFile );
	router.post('/multiple/:type', controller.uploadMultipleFile );

	return router;
  }

}