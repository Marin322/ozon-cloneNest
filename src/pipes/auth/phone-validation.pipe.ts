import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class PhoneValidationPipe implements PipeTransform {
    transform(value: any) {
        let phone = String(value);

        if(!phone.startsWith('+7') && !phone.startsWith('8')) {
            throw new BadRequestException(
                "Номер телефона должен начинаться на +7 или 8"
            );
        };

        if (phone.startsWith('+7')) {
            phone = '8' + phone.slice(2);
        };

        const validChars = /^[0-9+\s()\-]+$/;

        if(!validChars.test(phone)) {
            throw new BadRequestException(
                "Номер телефона содержит недоступимые символы"
            );
        };

        if(phone.length < 11) {
            throw new BadRequestException(
                "Номер телефона должен содержать не менее 11 чисел"
            );
        };

        return phone;
    };
};