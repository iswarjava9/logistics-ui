import { Booking } from './booking.model';
export class BillOfLading {
    public id: number;
	public blNo: string;
	public cargoDescription: string;
	public carrierRefNo: string;
	public coloadedWith: string;
	public consignee: string;
	public cosolidationNo: string;
	public delieveryAgent: string;
	public exportReference: string;
	public forwardingAgent: string;
	public ftzNo: string;
	public ingateAtTerminal: string;
	public mblNo: string;
	public notify: string;
	public placeOfDelivery: string;
	public placeOfReceipt: string;
	public portOfDischarge: string;
	public portOfLoad: string;
	public precarriageBy: string;
	public shipper: string;
	public shipperRef: string;
    public vesselVoyage: string;
    public bookingId: number;
    public bookingDetail: Booking;
}