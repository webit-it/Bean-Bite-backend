import { VerifyQrProgressDto } from "../../../types/customerRewardProgress.type";
import { QrGenerateResponseDto } from "../../../types/qr.type";

export interface IQrService {
    generate(): Promise<QrGenerateResponseDto>
    verify(
        code: string,
        customerId: string
    ): Promise<IVerifyQrResponse>;

}
export interface IVerifyQrResponse {
    qrVerified: boolean;
    message: string;
    progress: VerifyQrProgressDto | null;
}
