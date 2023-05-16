import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ZBClient } from 'zeebe-node';
import { ZEEBE_CONNECTION_PROVIDER, ZeebeWorker, ZeebeJob } from 'nestjs-zeebe';
import {
Ctx,
Payload,
} from '@nestjs/microservices';
import { ZBWorker, ICustomHeaders, IInputVariables, IOutputVariables } from 'zeebe-node';
import { CreateProcessInstanceResponse } from 'zeebe-node/dist/lib/interfaces-grpc-1.0';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		@Inject(WINSTON_MODULE_PROVIDER) 
		private readonly logger: Logger,
		@Inject(ZEEBE_CONNECTION_PROVIDER)
		private readonly zbClient: ZBClient
		 ) {}	

	@Get()
	getHello() : Promise<CreateProcessInstanceResponse> {
	 	return this.zbClient.createProcessInstance('order-process', { test: 1, or: 'romano'});
	}

	// Subscribe to events of type 'payment-service
	@ZeebeWorker('email:send') //, { fetchVariable: ['email']}
	paymentService(@Payload() job: ZeebeJob, @Ctx() context: { complete, worker: ZBWorker<IInputVariables, ICustomHeaders, IOutputVariables> }) {
		this.logger.info('Mailer-service, Task variables', job.variables);
		let updatedVariables = Object.assign({}, job.variables, {
		paymentService: 'Did my job',
		});
	  	// Task worker business logic goes here

		job.complete(updatedVariables);
	}
}