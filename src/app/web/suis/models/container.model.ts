import {Cargo} from './cargo.model';
import {ContainerType} from './containerType.model';

export class Container {
public id: number;
  public containerNo: string;
  public equipment: string;
  public grossKgs: number;
  public grossLbs: number;
  public seal1: string;
  public seal2: string;
  public seal3: string;
  public tareKgs: number;
  public tareLbs: number;
  public vehicleNo: number;
  public stuffingNo: number;
  public railwayBillNo: number;

  // Dates
  public pickupLocalDateTime: Date;
  public plannedShipLocalDateTime: Date;
  public cusPickupLastFreeLocalDateTime: Date;
  public cusReturnLastFreeLocalDateTime: Date;
  public carrierPickupLastFreeLocalDateTime: Date;
  public carrierReturnLastFreeLocalDateTime: Date;
  public dischargeLocalDateTime: Date;

  public cargos: Cargo[];
  public bookingId: number;
  public containerType: ContainerType;
  public quotationId: number;

  constructor() {}
}
