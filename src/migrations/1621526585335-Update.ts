import {MigrationInterface, QueryRunner} from "typeorm";

export class Update1621526585335 implements MigrationInterface {
    name = 'Update1621526585335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "achievement_joined_course_course" ("achievementId" uuid NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_b9874265965af78f8f13b91f342" PRIMARY KEY ("achievementId", "courseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_afd41daf68ae0c9da0938f2ff2" ON "achievement_joined_course_course" ("achievementId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f56227c3a379998f10633d3d97" ON "achievement_joined_course_course" ("courseId") `);
        await queryRunner.query(`CREATE TABLE "achievement_follow_achievement" ("achievementId_1" uuid NOT NULL, "achievementId_2" uuid NOT NULL, CONSTRAINT "PK_a4d45ab728b07aec5100bc3b9c0" PRIMARY KEY ("achievementId_1", "achievementId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_05b230f4248c542b58f511976d" ON "achievement_follow_achievement" ("achievementId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_b2043a1d5005d24f1d4552fe40" ON "achievement_follow_achievement" ("achievementId_2") `);
        await queryRunner.query(`CREATE TABLE "achievement_followed_by_achievement" ("achievementId_1" uuid NOT NULL, "achievementId_2" uuid NOT NULL, CONSTRAINT "PK_c35f70aea3922ee88a135f90604" PRIMARY KEY ("achievementId_1", "achievementId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e91bb1bf4bd4de4c34d3fa7eaf" ON "achievement_followed_by_achievement" ("achievementId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0b6462887e02da67ede4453fe" ON "achievement_followed_by_achievement" ("achievementId_2") `);
        await queryRunner.query(`CREATE TABLE "achievement_completed_courses_course" ("achievementId" uuid NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_3e19134986d37c2e3beda72369b" PRIMARY KEY ("achievementId", "courseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b29bb0660aa013101fc4122c85" ON "achievement_completed_courses_course" ("achievementId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fccf8e3781611f9a716a38667d" ON "achievement_completed_courses_course" ("courseId") `);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "achievementId" uuid`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD CONSTRAINT "UQ_8fcd0f004c1581eacae3871c339" UNIQUE ("achievementId")`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD CONSTRAINT "FK_8fcd0f004c1581eacae3871c339" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_joined_course_course" ADD CONSTRAINT "FK_afd41daf68ae0c9da0938f2ff2f" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_joined_course_course" ADD CONSTRAINT "FK_f56227c3a379998f10633d3d973" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_follow_achievement" ADD CONSTRAINT "FK_05b230f4248c542b58f511976db" FOREIGN KEY ("achievementId_1") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_follow_achievement" ADD CONSTRAINT "FK_b2043a1d5005d24f1d4552fe407" FOREIGN KEY ("achievementId_2") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_followed_by_achievement" ADD CONSTRAINT "FK_e91bb1bf4bd4de4c34d3fa7eaf4" FOREIGN KEY ("achievementId_1") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_followed_by_achievement" ADD CONSTRAINT "FK_c0b6462887e02da67ede4453fe5" FOREIGN KEY ("achievementId_2") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_completed_courses_course" ADD CONSTRAINT "FK_b29bb0660aa013101fc4122c851" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_completed_courses_course" ADD CONSTRAINT "FK_fccf8e3781611f9a716a38667db" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievement_completed_courses_course" DROP CONSTRAINT "FK_fccf8e3781611f9a716a38667db"`);
        await queryRunner.query(`ALTER TABLE "achievement_completed_courses_course" DROP CONSTRAINT "FK_b29bb0660aa013101fc4122c851"`);
        await queryRunner.query(`ALTER TABLE "achievement_followed_by_achievement" DROP CONSTRAINT "FK_c0b6462887e02da67ede4453fe5"`);
        await queryRunner.query(`ALTER TABLE "achievement_followed_by_achievement" DROP CONSTRAINT "FK_e91bb1bf4bd4de4c34d3fa7eaf4"`);
        await queryRunner.query(`ALTER TABLE "achievement_follow_achievement" DROP CONSTRAINT "FK_b2043a1d5005d24f1d4552fe407"`);
        await queryRunner.query(`ALTER TABLE "achievement_follow_achievement" DROP CONSTRAINT "FK_05b230f4248c542b58f511976db"`);
        await queryRunner.query(`ALTER TABLE "achievement_joined_course_course" DROP CONSTRAINT "FK_f56227c3a379998f10633d3d973"`);
        await queryRunner.query(`ALTER TABLE "achievement_joined_course_course" DROP CONSTRAINT "FK_afd41daf68ae0c9da0938f2ff2f"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP CONSTRAINT "FK_8fcd0f004c1581eacae3871c339"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP CONSTRAINT "UQ_8fcd0f004c1581eacae3871c339"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "achievementId"`);
        await queryRunner.query(`DROP INDEX "IDX_fccf8e3781611f9a716a38667d"`);
        await queryRunner.query(`DROP INDEX "IDX_b29bb0660aa013101fc4122c85"`);
        await queryRunner.query(`DROP TABLE "achievement_completed_courses_course"`);
        await queryRunner.query(`DROP INDEX "IDX_c0b6462887e02da67ede4453fe"`);
        await queryRunner.query(`DROP INDEX "IDX_e91bb1bf4bd4de4c34d3fa7eaf"`);
        await queryRunner.query(`DROP TABLE "achievement_followed_by_achievement"`);
        await queryRunner.query(`DROP INDEX "IDX_b2043a1d5005d24f1d4552fe40"`);
        await queryRunner.query(`DROP INDEX "IDX_05b230f4248c542b58f511976d"`);
        await queryRunner.query(`DROP TABLE "achievement_follow_achievement"`);
        await queryRunner.query(`DROP INDEX "IDX_f56227c3a379998f10633d3d97"`);
        await queryRunner.query(`DROP INDEX "IDX_afd41daf68ae0c9da0938f2ff2"`);
        await queryRunner.query(`DROP TABLE "achievement_joined_course_course"`);
    }

}
