import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsEmail({}, { message: "Invalid email." })
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters long." })
    @Transform(({ value }) => value?.trim().toLowerCase())
    password: string;
}
