import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateMortgageRequestDto {
 
  @ApiProperty()
  @IsNotEmpty({ message: 'Enter your User ID' })
  @IsNumber()
  userId: number; 

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Enter your property id.'})
  propertyId: string;
 
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Enter your requested fund in number.'})
  @Min(1)
  loanAmount: number;
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Enter your Repayment Period in number of months.'})
  @Min(1)
  repaymentPeriod: number;  // Could be a number if it's in months.
}
