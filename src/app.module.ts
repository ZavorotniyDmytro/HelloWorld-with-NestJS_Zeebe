import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ZeebeModule } from 'nestjs-zeebe';
import { ZeebeServer } from 'nestjs-zeebe/dist/transport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as winston from 'winston'

@Module({
	imports: [
		ZeebeModule.forRoot({
			options: {
				longPoll: 30000
			}
			// gatewayAddress: 'localhost:26500'
		}),
		WinstonModule.forRoot({
			transports: [new winston.transports.Console()]
		})
	],
	controllers: [AppController],
	providers: [AppService, ZeebeServer],
})
export class AppModule {}
