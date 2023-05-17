import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ZeebeAsyncOptions, ZeebeClientOptions, ZeebeModule } from 'nestjs-zeebe';
import { ZeebeServer } from 'nestjs-zeebe/dist/transport';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import * as winston from 'winston'
import { ConfigService } from '@nestjs/config';
import { ZBClient } from 'zeebe-node';

export const oAuthZeebe: ZeebeAsyncOptions = {
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => ({
		options: {
			oAuth: {
				url: configService.get<string>('ZEEBE_AUTHORIZATION_SERVER_URL'),
				audience: configService.get<string>('ZEEBE_TOKEN_AUDIENCE'),
				clientId: configService.get<string>('ZEEBE_CLIENT_ID'),
				clientSecret: configService.get<string>('ZEEBE_CLIENT_SECRET'),
			}
		},
	})
}

export const oAuthZeebeTLS: ZeebeAsyncOptions = {
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => ({
		options: {
			useTLS: true,
			oAuth: {
				url: configService.get<string>('ZEEBE_AUTHORIZATION_SERVER_URL'),
				audience: configService.get<string>('ZEEBE_TOKEN_AUDIENCE'),
				clientId: configService.get<string>('ZEEBE_CLIENT_ID'),
				clientSecret: configService.get<string>('ZEEBE_CLIENT_SECRET'),
			}
		},
	})
}

export const camundaCloud: ZeebeAsyncOptions = {
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => ({
		gatewayAddress: configService.get<string>('ZEEBE_CLUSTER_URL'),
		options: {
			useTLS: true,
			camundaCloud: {
				clusterId: configService.get<string>('CAMUNDA_CLUSTER_ID'),
				clusterRegion: configService.get<string>('CAMUNDA_CLUSTER_REGION'),
				clientId: configService.get<string>('ZEEBE_CLIENT_ID'),
				clientSecret: configService.get<string>('ZEEBE_CLIENT_SECRET'),
				cacheDir: './camunda-server/tokens'
			}
		},
	})
}

export const simpleConnect: ZeebeAsyncOptions = {
	inject: [ConfigService],
	useFactory: (configService: ConfigService, logger: winston.Logger) => ({
		gatewayAddress: 'localhost:26501',
		options:{
			retry: true,
			maxRetries: 20,
			useTLS: false,
			longPoll: 30000
		}
	})
}



@Module({
	imports: [
		ZBClient,
		ZeebeModule.forRootAsync(simpleConnect),
		// ZeebeModule.forRoot({
		// 	gatewayAddress: 'localhost:26501',
		// 		options: {					
		// 			useTLS: true,
		// 			longPoll: 3000,
		// 			retry: true,					
		// 		}
		// }),

		WinstonModule.forRoot({
			transports: [new winston.transports.Console()]
		}),
		ConfigModule
	],
	controllers: [AppController],
	providers: [ZeebeServer, ZBClient],
})
export class AppModule {}
