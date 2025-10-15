/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, Get, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto, UpdateLocationDto } from 'src/dto/location.dto';
import { Location } from 'src/entities/geojson.entity';
import { LocationService } from 'src/services/location.service';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiBody({ type: CreateLocationDto, description: 'WKT geometry and name' })
  @ApiResponse({
    status: 201,
    description: 'The location has been successfully created.',
    type: Location,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationService.create({
      name: createLocationDto.name,
      geometry: createLocationDto.geometry,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'List of all locations', type: [Location] })
  async findAll(): Promise<Location[]> {
    return this.locationService.findAll();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a location by ID' })
  @ApiResponse({ status: 200, description: 'Location found', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a location by ID' })
  @ApiBody({ type: UpdateLocationDto, description: 'Updated name or geometry' })
  @ApiResponse({ status: 200, description: 'Location updated', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationService.update(id, updateLocationDto);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a location by ID' })
  @ApiResponse({ status: 200, description: 'Location deleted' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.locationService.remove(id);
  }
}
