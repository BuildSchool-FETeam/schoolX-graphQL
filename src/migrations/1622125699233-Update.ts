import {MigrationInterface, QueryRunner} from "typeorm";

export class Update1622125699233 implements MigrationInterface {
    name = 'Update1622125699233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "activationCodeExpire"`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "activationCodeExpire" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "activationCodeExpire"`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "activationCodeExpire" integer`);
    }

}
