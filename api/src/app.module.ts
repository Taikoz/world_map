/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AdminJS from 'adminjs';
import { Location } from 'src/entities/geojson.entity';
import { LocationController } from 'src/controllers/location.controller';
import { LocationService } from 'src/services/location.service';
import { DataSource } from 'typeorm';

const DEFAULT_ADMIN = {
  email: 'admin@gmail.com',
  password: 'admin',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

async function setupAdminJS() {
  const { Database, Resource } = await import('@adminjs/typeorm');

  // ... rest of your code
  AdminJS.registerAdapter({ Database, Resource });
}

setupAdminJS();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        imports: [TypeOrmModule],
        inject: [getDataSourceToken()],
        useFactory: (dataSource: DataSource) => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: Location,
                options: {
                  properties: {
                    geometry: {
                      type: 'string',
                      isVisible: {
                        list: true,
                        filter: true,
                        show: true,
                        edit: true,
                      },
                      props: {
                        placeholder: 'POINT(lon lat) ou POLYGON((lon lat,...))',
                      },
                    },
                  },
                  actions: {
                    new: {
                      handler: async (request, response, context) => {
                        if (request.method === 'post') {
                          const { name, geometry } = request.payload;

                          // Insert using ST_GeomFromText
                          const result = await dataSource
                            .createQueryBuilder()
                            .insert()
                            .into(Location)
                            .values({
                              name,
                              geometry: () =>
                                `ST_GeomFromText('${geometry}', 4326)`,
                            })
                            .returning('*')
                            .execute();

                          return {
                            record: result.raw[0],
                            redirectUrl: context.h.recordActionUrl({
                              resourceId: context.resource.id(),
                              recordId: result.raw[0].id,
                              actionName: 'show',
                            }),
                          };
                        }
                        return response;
                      },
                    },
                    show: {
                      handler: async (request, response, context) => {
                        const recordId = context.record?.id();
                        if (!recordId) return response;

                        const result = await dataSource
                          .createQueryBuilder()
                          .select(['id', 'name'])
                          .addSelect('ST_AsGeoJSON(geometry)', 'geometry')
                          .from(Location, 'location')
                          .where('id = :id', { id: recordId })
                          .getRawOne();

                        const record = context.resource.build(result);

                        return {
                          record: record.toJSON(),
                        };
                      },
                    },
                  },
                },
              },
            ],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        }),
      }),
    ),
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class AppModule {}
