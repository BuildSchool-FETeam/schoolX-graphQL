import {MigrationInterface, QueryRunner} from "typeorm";

export class changeHint1617894781941 implements MigrationInterface {
    name = 'changeHint1617894781941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "score" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "score" double precision NOT NULL`);
    }

}
