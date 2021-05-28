import {MigrationInterface, QueryRunner} from "typeorm";

export class Update1621506816817 implements MigrationInterface {
    name = 'Update1621506816817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_user" ADD "roleName" character varying`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD CONSTRAINT "FK_7886aed98d70da8a598c67339fd" FOREIGN KEY ("roleName") REFERENCES "role"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_user" DROP CONSTRAINT "FK_7886aed98d70da8a598c67339fd"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "roleName"`);
    }

}
