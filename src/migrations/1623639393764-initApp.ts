import {MigrationInterface, QueryRunner} from "typeorm";

export class initApp1623639393764 implements MigrationInterface {
    name = 'initApp1623639393764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "achievement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rank" integer NOT NULL, "score" integer NOT NULL, "clientUserId" uuid, CONSTRAINT "REL_8848b1517a0b4ed098bf148388" UNIQUE ("clientUserId"), CONSTRAINT "PK_441339f40e8ce717525a381671e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_notification" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "recipientByAdminIds" character varying NOT NULL, "createdById" uuid, CONSTRAINT "PK_d0e228b0be64aedd7ad1ca97588" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`CREATE TABLE "course_joined_users_achievement" ("courseId" integer NOT NULL, "achievementId" uuid NOT NULL, CONSTRAINT "PK_5abe30ea354da961b10fdd86580" PRIMARY KEY ("courseId", "achievementId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bf4111d00a33bdf079330c7d84" ON "course_joined_users_achievement" ("courseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f551ef520833f1e1a37ea2133b" ON "course_joined_users_achievement" ("achievementId") `);
        await queryRunner.query(`CREATE TABLE "course_completed_user_achievement" ("courseId" integer NOT NULL, "achievementId" uuid NOT NULL, CONSTRAINT "PK_0a401e09f241c2398551c396ea8" PRIMARY KEY ("courseId", "achievementId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22e79d2a3f4d68edd5ca701844" ON "course_completed_user_achievement" ("courseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1798c9b47c106fdebafa9772db" ON "course_completed_user_achievement" ("achievementId") `);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "githubUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "dayOfBirth" character varying`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "homeTown" character varying`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "bio" character varying`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "isActive" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "activationCode" character varying`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "activationCodeExpire" bigint`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "roleName" character varying`);
        await queryRunner.query(`ALTER TABLE "client_user" ALTER COLUMN "imageUrl" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "client_user"."imageUrl" IS NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ALTER COLUMN "filePath" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "client_user"."filePath" IS NULL`);
        await queryRunner.query(`ALTER TABLE "achievement" ADD CONSTRAINT "FK_8848b1517a0b4ed098bf1483880" FOREIGN KEY ("clientUserId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD CONSTRAINT "FK_7886aed98d70da8a598c67339fd" FOREIGN KEY ("roleName") REFERENCES "role"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_notification" ADD CONSTRAINT "FK_95abf8cf7dc7f497958939c3418" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_joined_course_course" ADD CONSTRAINT "FK_afd41daf68ae0c9da0938f2ff2f" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_joined_course_course" ADD CONSTRAINT "FK_f56227c3a379998f10633d3d973" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_follow_achievement" ADD CONSTRAINT "FK_05b230f4248c542b58f511976db" FOREIGN KEY ("achievementId_1") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_follow_achievement" ADD CONSTRAINT "FK_b2043a1d5005d24f1d4552fe407" FOREIGN KEY ("achievementId_2") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_followed_by_achievement" ADD CONSTRAINT "FK_e91bb1bf4bd4de4c34d3fa7eaf4" FOREIGN KEY ("achievementId_1") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_followed_by_achievement" ADD CONSTRAINT "FK_c0b6462887e02da67ede4453fe5" FOREIGN KEY ("achievementId_2") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_completed_courses_course" ADD CONSTRAINT "FK_b29bb0660aa013101fc4122c851" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_completed_courses_course" ADD CONSTRAINT "FK_fccf8e3781611f9a716a38667db" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_joined_users_achievement" ADD CONSTRAINT "FK_bf4111d00a33bdf079330c7d845" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_joined_users_achievement" ADD CONSTRAINT "FK_f551ef520833f1e1a37ea2133ba" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_completed_user_achievement" ADD CONSTRAINT "FK_22e79d2a3f4d68edd5ca7018447" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_completed_user_achievement" ADD CONSTRAINT "FK_1798c9b47c106fdebafa9772db4" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_completed_user_achievement" DROP CONSTRAINT "FK_1798c9b47c106fdebafa9772db4"`);
        await queryRunner.query(`ALTER TABLE "course_completed_user_achievement" DROP CONSTRAINT "FK_22e79d2a3f4d68edd5ca7018447"`);
        await queryRunner.query(`ALTER TABLE "course_joined_users_achievement" DROP CONSTRAINT "FK_f551ef520833f1e1a37ea2133ba"`);
        await queryRunner.query(`ALTER TABLE "course_joined_users_achievement" DROP CONSTRAINT "FK_bf4111d00a33bdf079330c7d845"`);
        await queryRunner.query(`ALTER TABLE "achievement_completed_courses_course" DROP CONSTRAINT "FK_fccf8e3781611f9a716a38667db"`);
        await queryRunner.query(`ALTER TABLE "achievement_completed_courses_course" DROP CONSTRAINT "FK_b29bb0660aa013101fc4122c851"`);
        await queryRunner.query(`ALTER TABLE "achievement_followed_by_achievement" DROP CONSTRAINT "FK_c0b6462887e02da67ede4453fe5"`);
        await queryRunner.query(`ALTER TABLE "achievement_followed_by_achievement" DROP CONSTRAINT "FK_e91bb1bf4bd4de4c34d3fa7eaf4"`);
        await queryRunner.query(`ALTER TABLE "achievement_follow_achievement" DROP CONSTRAINT "FK_b2043a1d5005d24f1d4552fe407"`);
        await queryRunner.query(`ALTER TABLE "achievement_follow_achievement" DROP CONSTRAINT "FK_05b230f4248c542b58f511976db"`);
        await queryRunner.query(`ALTER TABLE "achievement_joined_course_course" DROP CONSTRAINT "FK_f56227c3a379998f10633d3d973"`);
        await queryRunner.query(`ALTER TABLE "achievement_joined_course_course" DROP CONSTRAINT "FK_afd41daf68ae0c9da0938f2ff2f"`);
        await queryRunner.query(`ALTER TABLE "admin_notification" DROP CONSTRAINT "FK_95abf8cf7dc7f497958939c3418"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP CONSTRAINT "FK_7886aed98d70da8a598c67339fd"`);
        await queryRunner.query(`ALTER TABLE "achievement" DROP CONSTRAINT "FK_8848b1517a0b4ed098bf1483880"`);
        await queryRunner.query(`COMMENT ON COLUMN "client_user"."filePath" IS NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ALTER COLUMN "filePath" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "client_user"."imageUrl" IS NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ALTER COLUMN "imageUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "roleName"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "activationCodeExpire"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "activationCode"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "homeTown"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "dayOfBirth"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "githubUrl"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "IDX_1798c9b47c106fdebafa9772db"`);
        await queryRunner.query(`DROP INDEX "IDX_22e79d2a3f4d68edd5ca701844"`);
        await queryRunner.query(`DROP TABLE "course_completed_user_achievement"`);
        await queryRunner.query(`DROP INDEX "IDX_f551ef520833f1e1a37ea2133b"`);
        await queryRunner.query(`DROP INDEX "IDX_bf4111d00a33bdf079330c7d84"`);
        await queryRunner.query(`DROP TABLE "course_joined_users_achievement"`);
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
        await queryRunner.query(`DROP TABLE "admin_notification"`);
        await queryRunner.query(`DROP TABLE "achievement"`);
    }

}
