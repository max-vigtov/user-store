import nodemailer, { Transporter } from 'nodemailer'

interface SendEmailOptions {
	to: string | string[];
	subject: string;
	htmlBody: string;
	attachments?: Attachment[];
}

interface Attachment{
	filenName: string;
	path: string
}

export class EmailService {
	private trasporter: Transporter

	constructor(
		mailerService: string,
		mailerEmail: string,
		senderEmailPassword: string,
	) {
		this.trasporter = nodemailer.createTransport({
			service: mailerService,
			auth: {
				user: mailerEmail,
				pass: senderEmailPassword,		
			},
		});
	}

	async sendEmail(options: SendEmailOptions):Promise<boolean> {

		const { to, subject, htmlBody, attachments = [] } = options;

		try {
			const sentInformation = await this.trasporter.sendMail({
				to: to,
				subject: subject,
				html: htmlBody,
				attachments
			});

			console.log( sentInformation );

			return true;

		} catch (error) {
			console.log(error);
			return false;
		}
	}
}