import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitApp1624716344143 implements MigrationInterface {
  name = 'InitApp1624716344143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP CONSTRAINT "FK_a1e7c2470588154415ce0b1d9fe"',
    );
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP CONSTRAINT "FK_2ae796e94ef5d41e414d036397f"',
    );
    await queryRunner.query(
      'ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"',
    );
    await queryRunner.query(
      'ALTER TABLE "article" DROP CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d"',
    );
    await queryRunner.query(
      'CREATE TABLE "achievement_completed_assignment_assignment" ("achievementId" uuid NOT NULL, "assignmentId" integer NOT NULL, CONSTRAINT "PK_89b0e9f3bded9db3543854cdde1" PRIMARY KEY ("achievementId", "assignmentId"))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_44b7546632e69d114f08351cd0" ON "achievement_completed_assignment_assignment" ("achievementId") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_8f718cca91f991144fbe1198d2" ON "achievement_completed_assignment_assignment" ("assignmentId") ',
    );
    await queryRunner.query(
      'CREATE TABLE "assignment_users_complete_achievement" ("assignmentId" integer NOT NULL, "achievementId" uuid NOT NULL, CONSTRAINT "PK_8a07e82bb89c1d74f2912c65021" PRIMARY KEY ("assignmentId", "achievementId"))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_a649cb6671a9d5268be4e6fafc" ON "assignment_users_complete_achievement" ("assignmentId") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_9cce75f9a8d7beb75d548d815e" ON "assignment_users_complete_achievement" ("achievementId") ',
    );
    await queryRunner.query(
      'ALTER TABLE "test_case" DROP COLUMN "expectedOutput"',
    );
    await queryRunner.query('ALTER TABLE "test_case" DROP COLUMN "input"');
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP COLUMN "createdById"',
    );
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP COLUMN "replyToId"',
    );
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "authorId"');
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "content"');
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "status"');
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "views"');
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "shares"');
    await queryRunner.query(
      'ALTER TABLE "article" DROP COLUMN "reviewComment"',
    );
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "createdById"');
    await queryRunner.query(
      'ALTER TABLE "test_case" ADD "generatedExpectResultScript" character varying NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "test_case" ADD "expectResult" character varying NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "test_case" ADD "runningTestScript" character varying NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "test_case" ADD "programingLanguage" character varying NOT NULL',
    );
    await queryRunner.query('ALTER TABLE "user_comment" ADD "authorId" uuid');
    await queryRunner.query(
      'ALTER TABLE "article" ADD "status" character varying DEFAULT \'pending\'',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD "views" integer DEFAULT \'0\'',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD "shares" integer DEFAULT \'0\'',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD "reviewComment" character varying',
    );
    await queryRunner.query('ALTER TABLE "article" ADD "createdById" uuid');
    await queryRunner.query('ALTER TABLE "article" ADD "authorId" uuid');
    await queryRunner.query('COMMENT ON COLUMN "user_comment"."votes" IS NULL');
    await queryRunner.query(
      'ALTER TABLE "user_comment" ALTER COLUMN "votes" DROP DEFAULT',
    );
    await queryRunner.query('COMMENT ON COLUMN "article"."votes" IS NULL');
    await queryRunner.query(
      'ALTER TABLE "article" ALTER COLUMN "votes" SET DEFAULT \'0\'',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ALTER COLUMN "votes" SET NOT NULL',
    );
    await queryRunner.query('COMMENT ON COLUMN "article"."votes" IS NULL');
    await queryRunner.query(
      'ALTER TABLE "user_comment" ADD CONSTRAINT "FK_19d0406f821caa3149825fe9693" FOREIGN KEY ("authorId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d" FOREIGN KEY ("createdById") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "achievement_completed_assignment_assignment" ADD CONSTRAINT "FK_44b7546632e69d114f08351cd03" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "achievement_completed_assignment_assignment" ADD CONSTRAINT "FK_8f718cca91f991144fbe1198d2f" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "assignment_users_complete_achievement" ADD CONSTRAINT "FK_a649cb6671a9d5268be4e6fafca" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "assignment_users_complete_achievement" ADD CONSTRAINT "FK_9cce75f9a8d7beb75d548d815ec" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "assignment_users_complete_achievement" DROP CONSTRAINT "FK_9cce75f9a8d7beb75d548d815ec"',
    );
    await queryRunner.query(
      'ALTER TABLE "assignment_users_complete_achievement" DROP CONSTRAINT "FK_a649cb6671a9d5268be4e6fafca"',
    );
    await queryRunner.query(
      'ALTER TABLE "achievement_completed_assignment_assignment" DROP CONSTRAINT "FK_8f718cca91f991144fbe1198d2f"',
    );
    await queryRunner.query(
      'ALTER TABLE "achievement_completed_assignment_assignment" DROP CONSTRAINT "FK_44b7546632e69d114f08351cd03"',
    );
    await queryRunner.query(
      'ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"',
    );
    await queryRunner.query(
      'ALTER TABLE "article" DROP CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d"',
    );
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP CONSTRAINT "FK_19d0406f821caa3149825fe9693"',
    );
    await queryRunner.query('COMMENT ON COLUMN "article"."votes" IS NULL');
    await queryRunner.query(
      'ALTER TABLE "article" ALTER COLUMN "votes" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ALTER COLUMN "votes" DROP DEFAULT',
    );
    await queryRunner.query('COMMENT ON COLUMN "article"."votes" IS NULL');
    await queryRunner.query(
      'ALTER TABLE "user_comment" ALTER COLUMN "votes" SET DEFAULT \'0\'',
    );
    await queryRunner.query('COMMENT ON COLUMN "user_comment"."votes" IS NULL');
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "authorId"');
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "createdById"');
    await queryRunner.query(
      'ALTER TABLE "article" DROP COLUMN "reviewComment"',
    );
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "shares"');
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "views"');
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "status"');
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "content"');
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP COLUMN "authorId"',
    );
    await queryRunner.query(
      'ALTER TABLE "test_case" DROP COLUMN "programingLanguage"',
    );
    await queryRunner.query(
      'ALTER TABLE "test_case" DROP COLUMN "runningTestScript"',
    );
    await queryRunner.query(
      'ALTER TABLE "test_case" DROP COLUMN "expectResult"',
    );
    await queryRunner.query(
      'ALTER TABLE "test_case" DROP COLUMN "generatedExpectResultScript"',
    );
    await queryRunner.query('ALTER TABLE "article" ADD "createdById" uuid');
    await queryRunner.query(
      'ALTER TABLE "article" ADD "reviewComment" character varying',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD "shares" integer DEFAULT \'0\'',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD "views" integer DEFAULT \'0\'',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD "status" character varying DEFAULT \'pending\'',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD "content" character varying NOT NULL',
    );
    await queryRunner.query('ALTER TABLE "article" ADD "authorId" uuid');
    await queryRunner.query(
      'ALTER TABLE "user_comment" ADD "replyToId" integer',
    );
    await queryRunner.query(
      'ALTER TABLE "user_comment" ADD "createdById" uuid',
    );
    await queryRunner.query(
      'ALTER TABLE "test_case" ADD "input" character varying NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "test_case" ADD "expectedOutput" character varying NOT NULL',
    );
    await queryRunner.query('DROP INDEX "IDX_9cce75f9a8d7beb75d548d815e"');
    await queryRunner.query('DROP INDEX "IDX_a649cb6671a9d5268be4e6fafc"');
    await queryRunner.query(
      'DROP TABLE "assignment_users_complete_achievement"',
    );
    await queryRunner.query('DROP INDEX "IDX_8f718cca91f991144fbe1198d2"');
    await queryRunner.query('DROP INDEX "IDX_44b7546632e69d114f08351cd0"');
    await queryRunner.query(
      'DROP TABLE "achievement_completed_assignment_assignment"',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d" FOREIGN KEY ("createdById") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "user_comment" ADD CONSTRAINT "FK_2ae796e94ef5d41e414d036397f" FOREIGN KEY ("replyToId") REFERENCES "user_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "user_comment" ADD CONSTRAINT "FK_a1e7c2470588154415ce0b1d9fe" FOREIGN KEY ("createdById") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }
}
