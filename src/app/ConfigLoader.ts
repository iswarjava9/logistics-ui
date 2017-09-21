import { ConfigService } from './web/suis/services/config.service';
import { environment } from '../environments/environment';

export function ConfigLoader(configService: ConfigService) {
//Note: this factory need to return a function (that return a promise)

  return () => configService.load(environment.configFile); 
}