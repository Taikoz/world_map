/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Location } from 'src/entities/geojson.entity';

@Injectable()
export class LocationService {
  constructor(private dataSource: DataSource) {}

  public async create(version: Partial<Location>): Promise<Location> {
    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values({
        name: version.name,
        geometry: () => `ST_GeomFromText('${version.geometry}', 4326)`,
      })
      .returning('*')
      .execute();

    return result.raw[0] as Location;
  }
  public async findAll(): Promise<Location[]> {
    const locations = await this.dataSource
      .getRepository(Location)
      .createQueryBuilder('location')
      .getMany();

    return locations;
  }

  public async findOne(id: number): Promise<Location> {
    const location = await this.dataSource
      .getRepository(Location)
      .createQueryBuilder('location')
      .where('location.id = :id', { id })
      .getOne();

    if (!location) {
      throw new NotFoundException(`Location with id ${id} not found`);
    }

    return location;
  }

  public async update(
    id: number,
    updateData: Partial<Location>,
  ): Promise<Location> {
    const location = await this.findOne(id);

    const updated = await this.dataSource
      .createQueryBuilder()
      .update(Location)
      .set({
        name: updateData.name ?? location.name,
        geometry: updateData.geometry
          ? () => `ST_GeomFromText('${updateData.geometry}', 4326)`
          : location.geometry,
      })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return updated.raw[0] as Location;
  }

  public async remove(id: number): Promise<void> {
    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(Location)
      .where('id = :id', { id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Location with id ${id} not found`);
    }
  }
}
