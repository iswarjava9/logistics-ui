  import {Customer} from './customer.model';
  import {Place} from './place.model';
  import {Client} from './client.model';
  import {User} from './user.model';
  import {Container} from './container.model';
  import {BusinessLine} from './businessLine.model';
  import {Person} from './person.model';
  import {MovementType} from './movementType.model';
  import {Vessel} from './vessel.model';
  import {Division} from './division.model';

  export class Booking {

    public id: number;
    public forwarderRefNo: string;
    public shipperRefNo: string;
    public nvoccBookingNo: string;
    public aesAuthNo: number;
    public bookingStatus: string;
    public carrierBookingNo: number;
    public carrierContact: string;
    public carrierVoyage: string;
    public controller: string;
    public freight: string;
    public nraNumber: string;
    public serviceContractId: number;
    public typeOfService: string;

    // Dates
    public docsCutOffDateTime: Date;
    public docsReceivedDate: Date;
    public eta: Date;
    public bookingDate: Date;
    public amendmentDate: Date;
    public cargoMovingDate: Date;
    public portCutOffDate: Date;
    public delieveryEta: Date;
    public railCutOffDateTime: Date;
    public sailDate: Date;

    // Parties
    public client: Client;
    public user: User;
    public deliveryAgent: Customer;
    public billTo: Customer;
    public consignee: Customer;
    public localSSLineOffice: Customer;
    public notify1: Customer;
    public notify2: Customer;
    public shipper: Customer;
    public carrier: Customer;

    public bookingAgent: Customer;
    public lineOfBusiness: BusinessLine;
    public salesRepresentative: Person;
    public typeOfMove: MovementType;
    public vessel: Vessel;
    public bookingPerson: Person;
    public division: Division;
    /*public carrier: Place;*/

    // Places
    public emptyContainerPickup: Place;
    public ingateAtTerminal: Place;
    public placeOfDelivery: Place;
    public placeOfReceipt: Place;
    public portOfDischarge: Place;
    public portOfLoad: Place;
    public transhipmentPort: Place;

    public remarks: string;


    // Container details
    public containerDetails: Container[];

    constructor() {}
  }
