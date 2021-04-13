import {MigrationInterface, QueryRunner} from "typeorm";

export class InitApp1618239735183 implements MigrationInterface {
    name = 'InitApp1618239735183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "levels"`);
        await queryRunner.query(`ALTER TABLE "course" ADD "levels" character varying DEFAULT 'Beginner'`);
        await queryRunner.query(`ALTER TABLE "assignment" ALTER COLUMN "score" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "assignment"."score" IS NULL`);
        await queryRunner.query(`ALTER TABLE "assignment" ALTER COLUMN "score" SET DEFAULT '10'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" ALTER COLUMN "score" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "assignment"."score" IS NULL`);
        await queryRunner.query(`ALTER TABLE "assignment" ALTER COLUMN "score" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "levels"`);
        await queryRunner.query(`ALTER TABLE "course" ADD "levels" integer`);
    }

}
