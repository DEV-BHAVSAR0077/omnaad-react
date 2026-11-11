import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = readFileSync(resolve(process.cwd(), 'database/schema.sql'), 'utf8');
    // shortcut: schema contains no routines/triggers, replace this splitter before adding SQL with embedded semicolons.
    for (const statement of sql.split(/;\s*(?:\r?\n|$)/).map((part) => part.trim()).filter(Boolean)) {
      await queryRunner.query(statement);
    }
  }
  public async down(): Promise<void> {
    throw new Error('Schema rollback is intentionally disabled to protect migrated production data. Restore a verified backup instead.');
  }
}
