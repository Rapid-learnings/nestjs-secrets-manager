import { Module } from '@nestjs/common';
import { awsConfigService } from './aws-config.service';

@Module({
  providers: [awsConfigService],
  exports: [awsConfigService]
})
export class awsConfigModule {}
