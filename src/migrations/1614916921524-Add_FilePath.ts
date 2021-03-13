import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFilePath1614916921524 implements MigrationInterface {
    name = 'AddFilePath1614916921524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instructor" ADD "filePath" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course" ADD "filePath" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "imageUrl" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "filePath" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "filePath"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "filePath"`);
        await queryRunner.query(`ALTER TABLE "instructor" DROP COLUMN "filePath"`);
    }

}
