import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddAdminDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

// export class UpdateAdminDto {
//   name?: string;
//   description?: string;
//   price?: number;
//   status?: boolean;
//   categoryId?: string;
// }
