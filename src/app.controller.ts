import { Controller, Get, Inject } from '@nestjs/common';
import { ZBClient } from 'zeebe-node';
import { ZEEBE_CONNECTION_PROVIDER, ZeebeWorker, ZeebeJob } from 'nestjs-zeebe';
import { Ctx, Payload, } from '@nestjs/microservices';
import { ZBWorker, ICustomHeaders, IInputVariables, IOutputVariables } from 'zeebe-node';
import { CreateProcessInstanceResponse } from 'zeebe-node/dist/lib/interfaces-grpc-1.0';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
	private zbClient: ZBClient

	constructor(
		private readonly configService: ConfigService,
		@Inject(WINSTON_MODULE_PROVIDER) 
		private readonly logger: Logger,
		// @Inject(ZEEBE_CONNECTION_PROVIDER)		private zbClient: ZBClient
		 ) {
			this.zbClient = new ZBClient({				
				onReady: () => console.log('Ready for action!'),
  				onConnectionError: () => console.log('The gRPC connection failed!')
			})
		 }

	@Get()
	getHello()  // Promise<CreateProcessInstanceResponse>
	{
		if (this.zbClient.connected)
		{
			return this.zbClient.createProcessInstance('email:send', { massage: 'Hello World!'});
		}
	}

	@ZeebeWorker('email:send')
	paymentService(@Payload() job: ZeebeJob, @Ctx() context: { complete, worker: ZBWorker<IInputVariables, ICustomHeaders, IOutputVariables> }) {
		this.logger.info('"Hello World!"-service, Task variables', job.variables);		
		let updatedVariables = Object.assign({}, job.variables, {
		paymentService: 'Did my job',
		});

		job.complete(updatedVariables);
		return job.variables.massage
	}
}