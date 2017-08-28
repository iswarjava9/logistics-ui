import {CargoTemplate} from './cargoTemplate.model';
import {Commodity} from './commodity.model';
import {PieceType} from './pieceType.model';

export class Cargo {

  public id: number;
  public cartoonHieght: number;
  public cartoonLength: number;
  public cartoonWidth: number;
  public cartoons: number;
  public contentsDescription: string;
  public grossCbm: string;
  public grossCft: string;
  public grossKgs: string;
  public grossLbs: string;
  public htsId: number;
  public netCbm: string;
  public netCft: string;
  public netKgs: string;
  public netLbs: string;
  public noOfPieces: number;
  public unit: string;
  public cargoTemplate: CargoTemplate;
  public commodity: Commodity;
  public containerId: number;
  public pieceType: PieceType;

  constructor() {}
}
