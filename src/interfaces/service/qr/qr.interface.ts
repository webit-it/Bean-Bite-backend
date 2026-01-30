import { QrGenerateResponseDto } from "../../../types/qr.type";

export interface IQrService{
    generate():Promise<QrGenerateResponseDto>
}