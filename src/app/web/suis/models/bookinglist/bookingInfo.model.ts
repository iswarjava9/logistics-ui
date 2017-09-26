import {ForeignAgentShortInfo} from '../metamodel/foreignAgentShortInfo.model';
import {AccountShortInfo} from '../metamodel/accountShortInfo.model';
import {ConsigneeShortInfo} from '../metamodel/consigneeShortInfo.model';
import {LocalSSLineOfficeShortInfo} from '../metamodel/localSSLineOfficeShortInfo.model';
import {NotifyShortInfo} from '../metamodel/notifyShortInfo.model';
import {ShipperShortInfo} from '../metamodel/shipperShortInfo.model';
import {LoadTerminalShortInfo} from '../metamodel/loadTerminalShortInfo.model';
import {ShortInfo} from '../metamodel/shortInfo.model';
import {PlaceOfReceiptShortInfo} from '../metamodel/placeOfReceiptShortInfo.model';
import {PortOfDischargeShortInfo} from '../metamodel/portOfDischargeShortInfo.model';
import {PortOfLoadShortInfo} from '../metamodel/portOfLoadShortInfo.model';
import {TranshipmentPortShortInfo} from '../metamodel/transhipmentPortShortInfo.model';

export class BookingInfo {
  public id: number;
  public aesAuthNo: string;
  public bookingPersonId: number;
  public bookingStatus: string;
  public carrierBookingNo: string;
  public carrierContact: string;
  public carrierId: string;
  public carrierVoyage: string;
  public controller: string;
  public divisionId: number;
  public forwarderId: number;
  public forwarderRefNo: string;
  public freight: string;
  public lineOfBusinessId: number;
  public nraNumber: number;
  public nvoccBookingNo: string;
  public salesRepresentativeId: string;
  public serviceContractId: number;
  public shipperRefNo: string;
  public typeOfMoveId: number;
  public typeOfServiceId: number;
  public vesselId: string;
  public clientId: number;
  public userId: string;
  public docsCutOffDateTime: string;
  public railCutOffDateTime: string;
  public docsReceivedDate: string;
  public eta: string;
  public sailDate: string;
  public cutOffDate: string;
  public delieveryEta: string;
  public cargoMovingDate: string;
  public bookingDate: string;
  public foreignAgentShortInfo: ForeignAgentShortInfo;
  public accountShortInfo: AccountShortInfo;
  public consigneeShortInfo: ConsigneeShortInfo;
  public localSSLineOfficeShortInfo: LocalSSLineOfficeShortInfo;
  public notifyShortInfo: NotifyShortInfo;
  public shipperShortInfo: ShipperShortInfo;
  public loadTerminalShortInfo: LoadTerminalShortInfo;
  public placeOfDeliveryShortInfo: ShortInfo;
  public placeOfReceiptShortInfo: PlaceOfReceiptShortInfo;
  public portOfDischargeShortInfo: PortOfDischargeShortInfo;
  public portOfLoadShortInfo: PortOfLoadShortInfo;
  public transhipmentPortShortInfo: TranshipmentPortShortInfo

  constructor() { }

}

