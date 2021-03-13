import {MigrationInterface, QueryRunner} from "typeorm";

export class SomeColumnCanBeNull1614938287336 implements MigrationInterface {
    name = 'SomeColumnCanBeNull1614938287336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "votes" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "course"."votes" IS NULL`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "timeByHour" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "course"."timeByHour" IS NULL`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "isCompleted" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "course"."isCompleted" IS NULL`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "levels"`);
        await queryRunner.query(`ALTER TABLE "course" ADD "levels" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "levels"`);
        await queryRunner.query(`ALTER TABLE "course" ADD "levels" smallint NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "course"."isCompleted" IS NULL`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "isCompleted" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "course"."timeByHour" IS NULL`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "timeByHour" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "course"."votes" IS NULL`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "votes" SET NOT NULL`);
    }

}
