import {MigrationInterface, QueryRunner} from "typeorm";

export class Activate1621741808678 implements MigrationInterface {
    name = 'Activate1621741808678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_user" ADD "isActive" integer`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "activationCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "activationCode"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "isActive"`);
    }

}
