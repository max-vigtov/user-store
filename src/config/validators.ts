import mongoose from "mongoose";


export class Validators {
	static isMondgoId( id: string ) {
		return mongoose.isValidObjectId( id );
	}
}