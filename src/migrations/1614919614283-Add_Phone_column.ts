import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPhoneColumn1614919614283 implements MigrationInterface {
    name = 'AddPhoneColumn1614919614283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instructor" ADD "phone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instructor" DROP COLUMN "phone"`);
    }

}
