import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string

  @Field()
  @IsNotEmpty()
  @IsString()
  address: string
}

@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  activationToken: string

  @Field()
  @IsNotEmpty()
  @IsString()
  activationCode: string
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string
}
