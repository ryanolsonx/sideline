import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { GameResolver } from './games/api/game.resolver';
import { GameService } from './games/service/game.service';
import { TeamResolver } from './teams/api/team.resolver';
import { TeamService } from './teams/service/team.service';

async function generateSchema() {
  const module = await Test.createTestingModule({
    imports: [GraphQLSchemaBuilderModule],
    providers: [
      GameResolver,
      TeamResolver,
      {
        provide: GameService,
        useValue: {},
      },
      {
        provide: TeamService,
        useValue: {},
      },
    ],
  }).compile();
  const factory = module.get(GraphQLSchemaFactory);
  const schema = await factory.create([GameResolver, TeamResolver]);

  const generatedHeader = '# ------------------------------------------------------\n# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n# ------------------------------------------------------\n\n';
  await writeFile(join(process.cwd(), 'schema.gql'), `${generatedHeader}${printSchema(lexicographicSortSchema(schema))}`);
  await module.close();
}

void generateSchema();
