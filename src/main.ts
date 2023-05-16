import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ZeebeServer } from 'nestjs-zeebe';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

	const microservice = app.connectMicroservice({
		strategy: app.get(ZeebeServer),
	})

	await app.startAllMicroservices()

	await app.listen(3000);
}
bootstrap();
