import { MigrationInterface, QueryRunner } from 'typeorm'

export class initiate1669517487623 implements MigrationInterface {
  name = 'initiate1669517487623'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "instructor" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "description" character varying NOT NULL, "imageUrl" character varying NOT NULL, "filePath" character varying NOT NULL, "phone" character varying NOT NULL, "userId" uuid, "createdById" uuid, CONSTRAINT "REL_a914853943da2844065d6e5c38" UNIQUE ("userId"), CONSTRAINT "PK_ccc0348eefb581ca002c05ef2f3" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "course" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "votes" integer, "imageUrl" character varying, "filePath" character varying, "timeByHour" smallint, "isCompleted" boolean, "benefits" character varying NOT NULL, "requirements" character varying NOT NULL, "levels" character varying DEFAULT 'Beginner', "instructorId" integer, "createdById" uuid, CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "lesson_document" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "url" character varying NOT NULL, "filePath" character varying NOT NULL, "lessonId" integer, CONSTRAINT "PK_f64ebdbeb66df431dff53e66a47" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "lesson" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "videoUrl" character varying NOT NULL, "votes" integer DEFAULT '0', "content" character varying NOT NULL, "courseId" integer, CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "test_case" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "generatedExpectResultScript" character varying NOT NULL, "timeEvaluation" integer, "expectResult" character varying NOT NULL, "runningTestScript" character varying NOT NULL, "programingLanguage" character varying NOT NULL, "codeChallengeId" uuid, CONSTRAINT "PK_ddd6142bdceedfe5161a0406984" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "code_challenge" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "hints" character varying NOT NULL, "score" integer DEFAULT '10', "input" character varying NOT NULL, "output" character varying NOT NULL, "languageSupport" character varying NOT NULL, "assignmentId" integer, CONSTRAINT "PK_04ebc0f5bfde9bb48b0d5fed786" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "file_assignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying, "maxScore" integer NOT NULL, "estimateTimeInMinute" integer NOT NULL, "contentInstruct" character varying, "videoInstruct" character varying, "explainContent" character varying, "explainVideo" character varying, "assignmentId" integer, CONSTRAINT "PK_f52257dee14325f49d288a324cc" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "question" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "order" integer, "options" text array, "isMultiple" boolean, "result" integer, "results" integer array, "quizId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "quiz" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "score" integer DEFAULT '10', "timeByMinute" integer NOT NULL DEFAULT '0', "assignmentId" integer, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "assignment" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lessonId" integer, CONSTRAINT "PK_43c2f5a3859f54cedafb270f37e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user_comment" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "votes" smallint NOT NULL DEFAULT '0', "createdById" uuid, "courseId" integer, "lessonId" integer, "assignmentId" integer, "articleId" integer, "replyToId" integer, "submittedAssignmentId" integer, CONSTRAINT "PK_09bced71952353c5ae4e40f0f52" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "article_tag" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_43dc2fa69a4739ce178e021d649" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "article" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "shortDescription" character varying NOT NULL, "content" character varying NOT NULL, "votes" integer DEFAULT '0', "status" character varying DEFAULT 'pending', "views" integer DEFAULT '0', "shares" integer DEFAULT '0', "reviewComment" character varying, "createdById" uuid, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "permission_set" ("id" SERIAL NOT NULL, "course" character varying NOT NULL, "user" character varying NOT NULL, "blog" character varying NOT NULL, "instructor" character varying NOT NULL, "permission" character varying NOT NULL, "notification" character varying NOT NULL, "roleName" character varying, "createdById" uuid, CONSTRAINT "REL_374499312af5eb006d9da5f00f" UNIQUE ("roleName"), CONSTRAINT "PK_40c60f41127ea51a22e63d291f9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "role" ("name" character varying NOT NULL, "id" character varying NOT NULL DEFAULT '1', CONSTRAINT "PK_ae4578dcaed5adff96595e61660" PRIMARY KEY ("name"))`
    )
    await queryRunner.query(
      `CREATE TABLE "achievement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rank" integer NOT NULL, "score" integer NOT NULL, "clientUserId" uuid, CONSTRAINT "REL_8848b1517a0b4ed098bf148388" UNIQUE ("clientUserId"), CONSTRAINT "PK_441339f40e8ce717525a381671e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "client_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "githubUrl" character varying, "dayOfBirth" character varying, "homeTown" character varying, "bio" character varying, "phone" character varying, "imageUrl" character varying, "filePath" character varying, "isActive" integer DEFAULT '0', "activationCode" character varying, "activationCodeExpire" bigint, "instructorId" integer, "roleName" character varying, CONSTRAINT "REL_f51d7282371b79acc0c36fad76" UNIQUE ("instructorId"), CONSTRAINT "PK_f18a6fabea7b2a90ab6bf10a650" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "group_assignment" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "previousScore" integer NOT NULL DEFAULT '0', "isUpdated" boolean NOT NULL DEFAULT true, "userId" uuid, "fileAssignmentId" uuid, CONSTRAINT "PK_87a3156de26cd619f0dab6d4411" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "submitted_assignment" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying, "order" integer NOT NULL, "fileUrl" character varying, "reApply" boolean, "hasSeen" boolean NOT NULL DEFAULT false, "groupId" integer, CONSTRAINT "PK_ea22fc3a23ff7a4c8984656dbca" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "evaluation_comment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "createdById" uuid, "submittedId" integer, CONSTRAINT "PK_b138e94a1297021cc6ea6eee546" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "admin_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying, "createdById" uuid, CONSTRAINT "PK_a28028ba709cd7e5053a86857b4" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "admin_notification" ("id" SERIAL NOT NULL, "title" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "recipientByAdminIds" character varying NOT NULL, "createdById" uuid, CONSTRAINT "PK_d0e228b0be64aedd7ad1ca97588" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "tag_courses_course" ("tagId" integer NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_d2cfeb711e33d4d9c9d8855b399" PRIMARY KEY ("tagId", "courseId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_dfc759b9650a51b70d09111745" ON "tag_courses_course" ("tagId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_87247ad9257f4e2ce3a500a999" ON "tag_courses_course" ("courseId") `
    )
    await queryRunner.query(
      `CREATE TABLE "course_joined_users_client_user" ("courseId" integer NOT NULL, "clientUserId" uuid NOT NULL, CONSTRAINT "PK_7381d7361c87b288890f00a3537" PRIMARY KEY ("courseId", "clientUserId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_541baa96cba48f1cbe399331d7" ON "course_joined_users_client_user" ("courseId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e5acb1f4bd5c1b6627c9ed91e4" ON "course_joined_users_client_user" ("clientUserId") `
    )
    await queryRunner.query(
      `CREATE TABLE "course_completed_user_client_user" ("courseId" integer NOT NULL, "clientUserId" uuid NOT NULL, CONSTRAINT "PK_cdcff2706b9ba40a427ce83cd7b" PRIMARY KEY ("courseId", "clientUserId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_621e81db830f4fb531d210a982" ON "course_completed_user_client_user" ("courseId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_783122cfa5434f3815fc530515" ON "course_completed_user_client_user" ("clientUserId") `
    )
    await queryRunner.query(
      `CREATE TABLE "assignment_users_complete_client_user" ("assignmentId" integer NOT NULL, "clientUserId" uuid NOT NULL, CONSTRAINT "PK_8b2eb835f69d664692d3cccd9c2" PRIMARY KEY ("assignmentId", "clientUserId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_145ac808ed30fa5c972ffebc91" ON "assignment_users_complete_client_user" ("assignmentId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c8705a3d2e56640e80e88a5ef8" ON "assignment_users_complete_client_user" ("clientUserId") `
    )
    await queryRunner.query(
      `CREATE TABLE "article_tag_articles_article" ("articleTagId" integer NOT NULL, "articleId" integer NOT NULL, CONSTRAINT "PK_b88643a956978548fa3ecea365f" PRIMARY KEY ("articleTagId", "articleId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8f7169ad0e33cda9f2baf800cd" ON "article_tag_articles_article" ("articleTagId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a09234a21b0e4a186bcc08216d" ON "article_tag_articles_article" ("articleId") `
    )
    await queryRunner.query(
      `CREATE TABLE "achievement_joined_course_course" ("achievementId" uuid NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_b9874265965af78f8f13b91f342" PRIMARY KEY ("achievementId", "courseId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_afd41daf68ae0c9da0938f2ff2" ON "achievement_joined_course_course" ("achievementId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f56227c3a379998f10633d3d97" ON "achievement_joined_course_course" ("courseId") `
    )
    await queryRunner.query(
      `CREATE TABLE "achievement_follow_client_user" ("achievementId" uuid NOT NULL, "clientUserId" uuid NOT NULL, CONSTRAINT "PK_04c07bbed95d71e2da9edd9a6f4" PRIMARY KEY ("achievementId", "clientUserId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_1dcb067d3aa9913861949a67d8" ON "achievement_follow_client_user" ("achievementId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_38cf4e076acade3bf2e7e4d1fe" ON "achievement_follow_client_user" ("clientUserId") `
    )
    await queryRunner.query(
      `CREATE TABLE "achievement_followed_by_client_user" ("achievementId" uuid NOT NULL, "clientUserId" uuid NOT NULL, CONSTRAINT "PK_578a428aab0c4da913fea605e22" PRIMARY KEY ("achievementId", "clientUserId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5954ca6e0e4c3608c43f22713d" ON "achievement_followed_by_client_user" ("achievementId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3e84c3b8209c4eb4117956a374" ON "achievement_followed_by_client_user" ("clientUserId") `
    )
    await queryRunner.query(
      `CREATE TABLE "achievement_completed_courses_course" ("achievementId" uuid NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_3e19134986d37c2e3beda72369b" PRIMARY KEY ("achievementId", "courseId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b29bb0660aa013101fc4122c85" ON "achievement_completed_courses_course" ("achievementId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_fccf8e3781611f9a716a38667d" ON "achievement_completed_courses_course" ("courseId") `
    )
    await queryRunner.query(
      `CREATE TABLE "achievement_completed_assignment_assignment" ("achievementId" uuid NOT NULL, "assignmentId" integer NOT NULL, CONSTRAINT "PK_89b0e9f3bded9db3543854cdde1" PRIMARY KEY ("achievementId", "assignmentId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_44b7546632e69d114f08351cd0" ON "achievement_completed_assignment_assignment" ("achievementId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8f718cca91f991144fbe1198d2" ON "achievement_completed_assignment_assignment" ("assignmentId") `
    )
    await queryRunner.query(
      `ALTER TABLE "instructor" ADD CONSTRAINT "FK_a914853943da2844065d6e5c383" FOREIGN KEY ("userId") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "instructor" ADD CONSTRAINT "FK_ce6e86bd3994debeedb4e37e050" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_32d94af473bb59d808d9a68e17b" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_2481291d5c97aaff5cf3ce5359c" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "lesson_document" ADD CONSTRAINT "FK_5e36459f19864b41ce715d46c53" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_3801ccf9533a8627c1dcb1e33bf" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "test_case" ADD CONSTRAINT "FK_736638f33b441dfbc621f85e886" FOREIGN KEY ("codeChallengeId") REFERENCES "code_challenge"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "code_challenge" ADD CONSTRAINT "FK_e864adfcc123d47ee2ef5a3cfa2" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "file_assignment" ADD CONSTRAINT "FK_ae747d63a2b15f70831c9ec4a8d" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD CONSTRAINT "FK_cefa2a420bf9c97527947595493" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_01c74e33f096093669cf9115510" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" ADD CONSTRAINT "FK_a1e7c2470588154415ce0b1d9fe" FOREIGN KEY ("createdById") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" ADD CONSTRAINT "FK_6289371e657912dec61859188ec" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" ADD CONSTRAINT "FK_c6a0e0174d223b6280fd473e90a" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" ADD CONSTRAINT "FK_2ef33d55c2a1caa93dc47436b27" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" ADD CONSTRAINT "FK_0f3902d2d0144f517fb46cbdd9f" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" ADD CONSTRAINT "FK_2ae796e94ef5d41e414d036397f" FOREIGN KEY ("replyToId") REFERENCES "user_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" ADD CONSTRAINT "FK_ddbc63544f72a7aab2bbce1cb3c" FOREIGN KEY ("submittedAssignmentId") REFERENCES "submitted_assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d" FOREIGN KEY ("createdById") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "permission_set" ADD CONSTRAINT "FK_374499312af5eb006d9da5f00f7" FOREIGN KEY ("roleName") REFERENCES "role"("name") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "permission_set" ADD CONSTRAINT "FK_29cd99f4a2fedff1cb74935c6a7" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement" ADD CONSTRAINT "FK_8848b1517a0b4ed098bf1483880" FOREIGN KEY ("clientUserId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "client_user" ADD CONSTRAINT "FK_f51d7282371b79acc0c36fad76f" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "client_user" ADD CONSTRAINT "FK_7886aed98d70da8a598c67339fd" FOREIGN KEY ("roleName") REFERENCES "role"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "group_assignment" ADD CONSTRAINT "FK_4b9501b1397d1fbae9bdd2db142" FOREIGN KEY ("userId") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "group_assignment" ADD CONSTRAINT "FK_f13ae62604d3992f9d4d5df6452" FOREIGN KEY ("fileAssignmentId") REFERENCES "file_assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submitted_assignment" ADD CONSTRAINT "FK_e41b12418648b409e58faaf8d1e" FOREIGN KEY ("groupId") REFERENCES "group_assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "evaluation_comment" ADD CONSTRAINT "FK_a80eeff0418708fe044af3a6346" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "evaluation_comment" ADD CONSTRAINT "FK_56759e2b2cc232c698f2367a4b8" FOREIGN KEY ("submittedId") REFERENCES "submitted_assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "admin_user" ADD CONSTRAINT "FK_faa5e69338cb413df6d4e4926b3" FOREIGN KEY ("role") REFERENCES "role"("name") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "admin_user" ADD CONSTRAINT "FK_ce2c117e51b3704f924a325e268" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "admin_notification" ADD CONSTRAINT "FK_95abf8cf7dc7f497958939c3418" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "tag_courses_course" ADD CONSTRAINT "FK_dfc759b9650a51b70d09111745e" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "tag_courses_course" ADD CONSTRAINT "FK_87247ad9257f4e2ce3a500a999c" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "course_joined_users_client_user" ADD CONSTRAINT "FK_541baa96cba48f1cbe399331d71" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "course_joined_users_client_user" ADD CONSTRAINT "FK_e5acb1f4bd5c1b6627c9ed91e46" FOREIGN KEY ("clientUserId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "course_completed_user_client_user" ADD CONSTRAINT "FK_621e81db830f4fb531d210a982e" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "course_completed_user_client_user" ADD CONSTRAINT "FK_783122cfa5434f3815fc5305152" FOREIGN KEY ("clientUserId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment_users_complete_client_user" ADD CONSTRAINT "FK_145ac808ed30fa5c972ffebc91d" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment_users_complete_client_user" ADD CONSTRAINT "FK_c8705a3d2e56640e80e88a5ef8d" FOREIGN KEY ("clientUserId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "article_tag_articles_article" ADD CONSTRAINT "FK_8f7169ad0e33cda9f2baf800cd0" FOREIGN KEY ("articleTagId") REFERENCES "article_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "article_tag_articles_article" ADD CONSTRAINT "FK_a09234a21b0e4a186bcc08216da" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_joined_course_course" ADD CONSTRAINT "FK_afd41daf68ae0c9da0938f2ff2f" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_joined_course_course" ADD CONSTRAINT "FK_f56227c3a379998f10633d3d973" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_follow_client_user" ADD CONSTRAINT "FK_1dcb067d3aa9913861949a67d8a" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_follow_client_user" ADD CONSTRAINT "FK_38cf4e076acade3bf2e7e4d1fe6" FOREIGN KEY ("clientUserId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_followed_by_client_user" ADD CONSTRAINT "FK_5954ca6e0e4c3608c43f22713d9" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_followed_by_client_user" ADD CONSTRAINT "FK_3e84c3b8209c4eb4117956a3740" FOREIGN KEY ("clientUserId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_completed_courses_course" ADD CONSTRAINT "FK_b29bb0660aa013101fc4122c851" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_completed_courses_course" ADD CONSTRAINT "FK_fccf8e3781611f9a716a38667db" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_completed_assignment_assignment" ADD CONSTRAINT "FK_44b7546632e69d114f08351cd03" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_completed_assignment_assignment" ADD CONSTRAINT "FK_8f718cca91f991144fbe1198d2f" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "achievement_completed_assignment_assignment" DROP CONSTRAINT "FK_8f718cca91f991144fbe1198d2f"`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_completed_assignment_assignment" DROP CONSTRAINT "FK_44b7546632e69d114f08351cd03"`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_completed_courses_course" DROP CONSTRAINT "FK_fccf8e3781611f9a716a38667db"`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_completed_courses_course" DROP CONSTRAINT "FK_b29bb0660aa013101fc4122c851"`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_followed_by_client_user" DROP CONSTRAINT "FK_3e84c3b8209c4eb4117956a3740"`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_followed_by_client_user" DROP CONSTRAINT "FK_5954ca6e0e4c3608c43f22713d9"`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_follow_client_user" DROP CONSTRAINT "FK_38cf4e076acade3bf2e7e4d1fe6"`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_follow_client_user" DROP CONSTRAINT "FK_1dcb067d3aa9913861949a67d8a"`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_joined_course_course" DROP CONSTRAINT "FK_f56227c3a379998f10633d3d973"`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement_joined_course_course" DROP CONSTRAINT "FK_afd41daf68ae0c9da0938f2ff2f"`
    )
    await queryRunner.query(
      `ALTER TABLE "article_tag_articles_article" DROP CONSTRAINT "FK_a09234a21b0e4a186bcc08216da"`
    )
    await queryRunner.query(
      `ALTER TABLE "article_tag_articles_article" DROP CONSTRAINT "FK_8f7169ad0e33cda9f2baf800cd0"`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment_users_complete_client_user" DROP CONSTRAINT "FK_c8705a3d2e56640e80e88a5ef8d"`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment_users_complete_client_user" DROP CONSTRAINT "FK_145ac808ed30fa5c972ffebc91d"`
    )
    await queryRunner.query(
      `ALTER TABLE "course_completed_user_client_user" DROP CONSTRAINT "FK_783122cfa5434f3815fc5305152"`
    )
    await queryRunner.query(
      `ALTER TABLE "course_completed_user_client_user" DROP CONSTRAINT "FK_621e81db830f4fb531d210a982e"`
    )
    await queryRunner.query(
      `ALTER TABLE "course_joined_users_client_user" DROP CONSTRAINT "FK_e5acb1f4bd5c1b6627c9ed91e46"`
    )
    await queryRunner.query(
      `ALTER TABLE "course_joined_users_client_user" DROP CONSTRAINT "FK_541baa96cba48f1cbe399331d71"`
    )
    await queryRunner.query(
      `ALTER TABLE "tag_courses_course" DROP CONSTRAINT "FK_87247ad9257f4e2ce3a500a999c"`
    )
    await queryRunner.query(
      `ALTER TABLE "tag_courses_course" DROP CONSTRAINT "FK_dfc759b9650a51b70d09111745e"`
    )
    await queryRunner.query(
      `ALTER TABLE "admin_notification" DROP CONSTRAINT "FK_95abf8cf7dc7f497958939c3418"`
    )
    await queryRunner.query(
      `ALTER TABLE "admin_user" DROP CONSTRAINT "FK_ce2c117e51b3704f924a325e268"`
    )
    await queryRunner.query(
      `ALTER TABLE "admin_user" DROP CONSTRAINT "FK_faa5e69338cb413df6d4e4926b3"`
    )
    await queryRunner.query(
      `ALTER TABLE "evaluation_comment" DROP CONSTRAINT "FK_56759e2b2cc232c698f2367a4b8"`
    )
    await queryRunner.query(
      `ALTER TABLE "evaluation_comment" DROP CONSTRAINT "FK_a80eeff0418708fe044af3a6346"`
    )
    await queryRunner.query(
      `ALTER TABLE "submitted_assignment" DROP CONSTRAINT "FK_e41b12418648b409e58faaf8d1e"`
    )
    await queryRunner.query(
      `ALTER TABLE "group_assignment" DROP CONSTRAINT "FK_f13ae62604d3992f9d4d5df6452"`
    )
    await queryRunner.query(
      `ALTER TABLE "group_assignment" DROP CONSTRAINT "FK_4b9501b1397d1fbae9bdd2db142"`
    )
    await queryRunner.query(
      `ALTER TABLE "client_user" DROP CONSTRAINT "FK_7886aed98d70da8a598c67339fd"`
    )
    await queryRunner.query(
      `ALTER TABLE "client_user" DROP CONSTRAINT "FK_f51d7282371b79acc0c36fad76f"`
    )
    await queryRunner.query(
      `ALTER TABLE "achievement" DROP CONSTRAINT "FK_8848b1517a0b4ed098bf1483880"`
    )
    await queryRunner.query(
      `ALTER TABLE "permission_set" DROP CONSTRAINT "FK_29cd99f4a2fedff1cb74935c6a7"`
    )
    await queryRunner.query(
      `ALTER TABLE "permission_set" DROP CONSTRAINT "FK_374499312af5eb006d9da5f00f7"`
    )
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" DROP CONSTRAINT "FK_ddbc63544f72a7aab2bbce1cb3c"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" DROP CONSTRAINT "FK_2ae796e94ef5d41e414d036397f"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" DROP CONSTRAINT "FK_0f3902d2d0144f517fb46cbdd9f"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" DROP CONSTRAINT "FK_2ef33d55c2a1caa93dc47436b27"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" DROP CONSTRAINT "FK_c6a0e0174d223b6280fd473e90a"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" DROP CONSTRAINT "FK_6289371e657912dec61859188ec"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment" DROP CONSTRAINT "FK_a1e7c2470588154415ce0b1d9fe"`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_01c74e33f096093669cf9115510"`
    )
    await queryRunner.query(
      `ALTER TABLE "quiz" DROP CONSTRAINT "FK_cefa2a420bf9c97527947595493"`
    )
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_4959a4225f25d923111e54c7cd2"`
    )
    await queryRunner.query(
      `ALTER TABLE "file_assignment" DROP CONSTRAINT "FK_ae747d63a2b15f70831c9ec4a8d"`
    )
    await queryRunner.query(
      `ALTER TABLE "code_challenge" DROP CONSTRAINT "FK_e864adfcc123d47ee2ef5a3cfa2"`
    )
    await queryRunner.query(
      `ALTER TABLE "test_case" DROP CONSTRAINT "FK_736638f33b441dfbc621f85e886"`
    )
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_3801ccf9533a8627c1dcb1e33bf"`
    )
    await queryRunner.query(
      `ALTER TABLE "lesson_document" DROP CONSTRAINT "FK_5e36459f19864b41ce715d46c53"`
    )
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_2481291d5c97aaff5cf3ce5359c"`
    )
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_32d94af473bb59d808d9a68e17b"`
    )
    await queryRunner.query(
      `ALTER TABLE "instructor" DROP CONSTRAINT "FK_ce6e86bd3994debeedb4e37e050"`
    )
    await queryRunner.query(
      `ALTER TABLE "instructor" DROP CONSTRAINT "FK_a914853943da2844065d6e5c383"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8f718cca91f991144fbe1198d2"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_44b7546632e69d114f08351cd0"`
    )
    await queryRunner.query(
      `DROP TABLE "achievement_completed_assignment_assignment"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fccf8e3781611f9a716a38667d"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b29bb0660aa013101fc4122c85"`
    )
    await queryRunner.query(`DROP TABLE "achievement_completed_courses_course"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3e84c3b8209c4eb4117956a374"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5954ca6e0e4c3608c43f22713d"`
    )
    await queryRunner.query(`DROP TABLE "achievement_followed_by_client_user"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_38cf4e076acade3bf2e7e4d1fe"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1dcb067d3aa9913861949a67d8"`
    )
    await queryRunner.query(`DROP TABLE "achievement_follow_client_user"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f56227c3a379998f10633d3d97"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_afd41daf68ae0c9da0938f2ff2"`
    )
    await queryRunner.query(`DROP TABLE "achievement_joined_course_course"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a09234a21b0e4a186bcc08216d"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8f7169ad0e33cda9f2baf800cd"`
    )
    await queryRunner.query(`DROP TABLE "article_tag_articles_article"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c8705a3d2e56640e80e88a5ef8"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_145ac808ed30fa5c972ffebc91"`
    )
    await queryRunner.query(
      `DROP TABLE "assignment_users_complete_client_user"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_783122cfa5434f3815fc530515"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_621e81db830f4fb531d210a982"`
    )
    await queryRunner.query(`DROP TABLE "course_completed_user_client_user"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e5acb1f4bd5c1b6627c9ed91e4"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_541baa96cba48f1cbe399331d7"`
    )
    await queryRunner.query(`DROP TABLE "course_joined_users_client_user"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87247ad9257f4e2ce3a500a999"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dfc759b9650a51b70d09111745"`
    )
    await queryRunner.query(`DROP TABLE "tag_courses_course"`)
    await queryRunner.query(`DROP TABLE "admin_notification"`)
    await queryRunner.query(`DROP TABLE "admin_user"`)
    await queryRunner.query(`DROP TABLE "evaluation_comment"`)
    await queryRunner.query(`DROP TABLE "submitted_assignment"`)
    await queryRunner.query(`DROP TABLE "group_assignment"`)
    await queryRunner.query(`DROP TABLE "client_user"`)
    await queryRunner.query(`DROP TABLE "achievement"`)
    await queryRunner.query(`DROP TABLE "role"`)
    await queryRunner.query(`DROP TABLE "permission_set"`)
    await queryRunner.query(`DROP TABLE "article"`)
    await queryRunner.query(`DROP TABLE "article_tag"`)
    await queryRunner.query(`DROP TABLE "user_comment"`)
    await queryRunner.query(`DROP TABLE "assignment"`)
    await queryRunner.query(`DROP TABLE "quiz"`)
    await queryRunner.query(`DROP TABLE "question"`)
    await queryRunner.query(`DROP TABLE "file_assignment"`)
    await queryRunner.query(`DROP TABLE "code_challenge"`)
    await queryRunner.query(`DROP TABLE "test_case"`)
    await queryRunner.query(`DROP TABLE "lesson"`)
    await queryRunner.query(`DROP TABLE "lesson_document"`)
    await queryRunner.query(`DROP TABLE "course"`)
    await queryRunner.query(`DROP TABLE "tag"`)
    await queryRunner.query(`DROP TABLE "instructor"`)
  }
}
