import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ZeebeModule } from 'nestjs-zeebe';
import { ZeebeServer } from 'nestjs-zeebe/dist/transport';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import * as winston from 'winston'
import { ConfigService } from '@nestjs/config';




@Module({
	imports: [
		ZeebeModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				options: {
					longPoll: 30000,
					camundaCloud: {
						clientId: configService.get<string>('ZEEBE_CLIENT_ID'),
						clientSecret: configService.get<string>('ZEEBE_CLIENT_SECRET'),
						clusterId: configService.get<string>('CAMUNDA_CLUSTER_ID'),
						clusterRegion: configService.get<string>('CAMUNDA_CLUSTER_REGION'),
					}
				},
			}),
		 }),

		WinstonModule.forRoot({
			transports: [new winston.transports.Console()]
		}),
		ConfigModule
	],
	controllers: [AppController],
	providers: [ZeebeServer],
})
export class AppModule {}
