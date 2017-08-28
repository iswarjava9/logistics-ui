import {ForeignAgentShortInfo} from '../metamodel/foreignAgentShortInfo.model';
import {AccountShortInfo} from '../metamodel/accountShortInfo.model';
import {ConsigneeShortInfo} from '../metamodel/consigneeShortInfo.model';
import {LocalSSLineOfficeShortInfo} from '../metamodel/localSSLineOfficeShortInfo.model';
import {NotifyShortInfo} from '../metamodel/notifyShortInfo.model';
import {ShipperShortInfo} from '../metamodel/shipperShortInfo.model';
import {LoadTerminalShortInfo} from '../metamodel/loadTerminalShortInfo.model';
import {PlaceOfDeliveryShortInfo} from '../metamodel/placeOfDeliveryShortInfo.model';
import {PlaceOfReceiptShortInfo} from '../metamodel/placeOfReceiptShortInfo.model';
import {PortOfDischargeShortInfo} from '../metamodel/portOfDischargeShortInfo.model';
import {PortOfLoadShortInfo} from '../metamodel/portOfLoadShortInfo.model';
import {TranshipmentPortShortInfo} from '../metamodel/transhipmentPortShortInfo.model';

export class BookingInfo {
  constructor(private id: number, private aesAuthNo: string, private bookingPersonId: number,
              private bookingStatus: string, private carrierBookingNo: string, private carrierContact: string,
              private carrierId: string, private carrierVoyage: string, private controller: string, private divisionId: number,
              private forwarderId: number, private forwarderRefNo: string, private freight: string, private lineOfBusinessId: number,
              private nraNumber: number, private nvoccBookingNo: string, private salesRepresentativeId: string,
              private serviceContractId: number, private shipperRefNo: string, private typeOfMoveId: number,
              private typeOfServiceId: number, private vesselId: string, private clientId: number, private userId: string,
              private docsCutOffDateTime: string, private rateCutOffDateTime: string, private docsReceivedDate: string,
              private eta: string, private sailDate: string, private cutOffDate: string, private delieveryEta: string,
              private cargoMovingDate: string, private bookingDate: Date, private foreignAgentShortInfo: ForeignAgentShortInfo,
              private accountShortInfo: AccountShortInfo, private consigneeShortInfo: ConsigneeShortInfo,
              private localSSLineOfficeShortInfo: LocalSSLineOfficeShortInfo, private notifyShortInfo: NotifyShortInfo,
              private shipperShortInfo: ShipperShortInfo, private loadTerminalShortInfo: LoadTerminalShortInfo,
              private placeOfDeliveryShortInfo: PlaceOfDeliveryShortInfo, private placeOfReceiptShortInfo: PlaceOfReceiptShortInfo,
              private portOfDischargeShortInfo: PortOfDischargeShortInfo, private portOfLoadShortInfo: PortOfLoadShortInfo,
              private transhipmentPortShortInfo: TranshipmentPortShortInfo) {}
}

