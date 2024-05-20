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
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string
}
