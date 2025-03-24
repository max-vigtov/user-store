import { Router } from "express";
import { ImagesController } from './controller';
import { FileUploadService } from "../services";
import { FileUploadMiddlware } from "../middlewares/file-upload.middleware";
import { TypeMiddlware } from "../middlewares/type.middleware";

export class ImagesRoutes {

  static get routes(): Router {

	const router = Router();
	
	const controller = new ImagesController(  );
	
	// Definir las rutas
	router.get('/:type/:img', controller.getImage );
	

	return router;
  }

}