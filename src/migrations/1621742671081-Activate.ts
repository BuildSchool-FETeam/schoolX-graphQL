import {MigrationInterface, QueryRunner} from "typeorm";

export class Activate1621742671081 implements MigrationInterface {
    name = 'Activate1621742671081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_user" ADD "activationCodeExpire" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "client_user"."isActive" IS NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ALTER COLUMN "isActive" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_user" ALTER COLUMN "isActive" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "client_user"."isActive" IS NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "activationCodeExpire"`);
    }

}
