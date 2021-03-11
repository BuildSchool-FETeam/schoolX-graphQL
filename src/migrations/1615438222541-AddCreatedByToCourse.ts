import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreatedByToCourse1615438222541 implements MigrationInterface {
    name = 'AddCreatedByToCourse1615438222541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_2481291d5c97aaff5cf3ce5359c" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_2481291d5c97aaff5cf3ce5359c"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "createdById"`);
    }

}
