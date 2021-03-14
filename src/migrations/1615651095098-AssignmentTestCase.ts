import {MigrationInterface, QueryRunner} from "typeorm";

export class AssignmentTestCase1615651095098 implements MigrationInterface {
    name = 'AssignmentTestCase1615651095098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_document" DROP CONSTRAINT "FK_5e36459f19864b41ce715d46c53"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_e2d4c49939395947ca573311800"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "REL_e2d4c49939395947ca57331180"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "testCaseId"`);
        await queryRunner.query(`ALTER TABLE "test_case" DROP CONSTRAINT "FK_7b36585a5f32744f923fe35cb3a"`);
        await queryRunner.query(`COMMENT ON COLUMN "test_case"."assignmentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "test_case" DROP CONSTRAINT "REL_7b36585a5f32744f923fe35cb3"`);
        await queryRunner.query(`ALTER TABLE "lesson_document" ADD CONSTRAINT "FK_5e36459f19864b41ce715d46c53" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "test_case" ADD CONSTRAINT "FK_7b36585a5f32744f923fe35cb3a" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_case" DROP CONSTRAINT "FK_7b36585a5f32744f923fe35cb3a"`);
        await queryRunner.query(`ALTER TABLE "lesson_document" DROP CONSTRAINT "FK_5e36459f19864b41ce715d46c53"`);
        await queryRunner.query(`ALTER TABLE "test_case" ADD CONSTRAINT "REL_7b36585a5f32744f923fe35cb3" UNIQUE ("assignmentId")`);
        await queryRunner.query(`COMMENT ON COLUMN "test_case"."assignmentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "test_case" ADD CONSTRAINT "FK_7b36585a5f32744f923fe35cb3a" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "testCaseId" integer`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "REL_e2d4c49939395947ca57331180" UNIQUE ("testCaseId")`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_e2d4c49939395947ca573311800" FOREIGN KEY ("testCaseId") REFERENCES "test_case"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_document" ADD CONSTRAINT "FK_5e36459f19864b41ce715d46c53" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
