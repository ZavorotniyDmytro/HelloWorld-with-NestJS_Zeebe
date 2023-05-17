import { Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleNest } from '@nestjs/config';

@Module({
	imports: [ConfigModuleNest.forRoot({
		envFilePath: '.env',
		isGlobal: true,
	 })]
})
export class ConfigModule {}
