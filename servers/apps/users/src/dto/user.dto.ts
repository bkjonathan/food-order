import {Field, InputType} from "@nestjs/graphql";
import {isEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

@InputType()
export class RegisterDto{
    @Field()
    @IsNotEmpty()
    @IsString()
    name:string;

    @Field()
    @IsNotEmpty()
    @MinLength(8)
    password:string;

    @Field()
    @IsNotEmpty()
    @isEmail()
    email:string;
}

@InputType()
export class LoginDto{
    @Field()
    @IsNotEmpty()
    @MinLength(8)
    password:string;

    @Field()
    @IsNotEmpty()
    @isEmail()
    email:string;
}