import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeTagAndCourse1615019117457 implements MigrationInterface {
    name = 'ChangeTagAndCourse1615019117457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag_courses_course" ("tagId" integer NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_d2cfeb711e33d4d9c9d8855b399" PRIMARY KEY ("tagId", "courseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dfc759b9650a51b70d09111745" ON "tag_courses_course" ("tagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_87247ad9257f4e2ce3a500a999" ON "tag_courses_course" ("courseId") `);
        await queryRunner.query(`ALTER TABLE "tag_courses_course" ADD CONSTRAINT "FK_dfc759b9650a51b70d09111745e" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag_courses_course" ADD CONSTRAINT "FK_87247ad9257f4e2ce3a500a999c" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag_courses_course" DROP CONSTRAINT "FK_87247ad9257f4e2ce3a500a999c"`);
        await queryRunner.query(`ALTER TABLE "tag_courses_course" DROP CONSTRAINT "FK_dfc759b9650a51b70d09111745e"`);
        await queryRunner.query(`DROP INDEX "IDX_87247ad9257f4e2ce3a500a999"`);
        await queryRunner.query(`DROP INDEX "IDX_dfc759b9650a51b70d09111745"`);
        await queryRunner.query(`DROP TABLE "tag_courses_course"`);
    }

}
