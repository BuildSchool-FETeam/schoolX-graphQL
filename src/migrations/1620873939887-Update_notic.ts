import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateNotic1620873939887 implements MigrationInterface {
    name = 'UpdateNotic1620873939887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_notification" DROP COLUMN "recipientByRoles"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_notification" ADD "recipientByRoles" character varying NOT NULL`);
    }

}
