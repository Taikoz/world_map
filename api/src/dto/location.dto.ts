import { PartialType } from '@nestjs/swagger';

export class CreateLocationDto {
  name: string;
  geometry: string;
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
