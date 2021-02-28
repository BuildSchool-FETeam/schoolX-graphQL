import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateApp1614270844158 implements MigrationInterface {
    name = 'CreateApp1614270844158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_user" DROP CONSTRAINT "FK_faa5e69338cb413df6d4e4926b3"`);
        await queryRunner.query(`ALTER TABLE "admin_user" ADD CONSTRAINT "FK_faa5e69338cb413df6d4e4926b3" FOREIGN KEY ("role") REFERENCES "role"("name") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_user" DROP CONSTRAINT "FK_faa5e69338cb413df6d4e4926b3"`);
        await queryRunner.query(`ALTER TABLE "admin_user" ADD CONSTRAINT "FK_faa5e69338cb413df6d4e4926b3" FOREIGN KEY ("role") REFERENCES "role"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
