import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateClientUser1621502053203 implements MigrationInterface {
    name = 'UpdateClientUser1621502053203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "achievement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rank" integer NOT NULL, "score" integer NOT NULL, CONSTRAINT "PK_441339f40e8ce717525a381671e" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`ALTER TABLE "client_user" ALTER COLUMN "imageUrl" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "client_user"."imageUrl" IS NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ALTER COLUMN "filePath" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "client_user"."filePath" IS NULL`);
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
        await queryRunner.query(`COMMENT ON COLUMN "client_user"."filePath" IS NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ALTER COLUMN "filePath" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "client_user"."imageUrl" IS NULL`);
        await queryRunner.query(`ALTER TABLE "client_user" ALTER COLUMN "imageUrl" SET NOT NULL`);
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
        await queryRunner.query(`DROP TABLE "achievement"`);
    }

}
