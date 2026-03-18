import { Hall } from "./hall";

export interface HallCharacteristics {
  id: number;
  name: string;
  imageUrl: string;
  globalDate: string;
  halls: Hall[];
}
