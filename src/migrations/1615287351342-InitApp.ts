import {MigrationInterface, QueryRunner} from "typeorm";

export class InitApp1615287351342 implements MigrationInterface {
    name = 'InitApp1615287351342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_document" DROP CONSTRAINT "FK_5e36459f19864b41ce715d46c53"`);
        await queryRunner.query(`ALTER TABLE "lesson_document" ADD "filePath" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "votes"`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "votes" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lesson_document" ADD CONSTRAINT "FK_5e36459f19864b41ce715d46c53" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_document" DROP CONSTRAINT "FK_5e36459f19864b41ce715d46c53"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "votes"`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "votes" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson_document" DROP COLUMN "filePath"`);
        await queryRunner.query(`ALTER TABLE "lesson_document" ADD CONSTRAINT "FK_5e36459f19864b41ce715d46c53" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
