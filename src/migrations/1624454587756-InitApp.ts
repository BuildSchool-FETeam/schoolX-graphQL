import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitApp1624454587756 implements MigrationInterface {
  name = 'InitApp1624454587756'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP CONSTRAINT "FK_19d0406f821caa3149825fe9693"'
    )
    await queryRunner.query(
      'CREATE TABLE "article_tag" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_43dc2fa69a4739ce178e021d649" PRIMARY KEY ("id"))'
    )
    await queryRunner.query(
      'CREATE TABLE "article" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "shortDescription" character varying NOT NULL, "content" character varying NOT NULL, "votes" integer DEFAULT \'0\', "status" character varying DEFAULT \'pending\', "views" integer DEFAULT \'0\', "shares" integer DEFAULT \'0\', "reviewComment" character varying, "createdById" uuid, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))'
    )
    await queryRunner.query(
      'CREATE TABLE "article_tag_articles_article" ("articleTagId" integer NOT NULL, "articleId" integer NOT NULL, CONSTRAINT "PK_b88643a956978548fa3ecea365f" PRIMARY KEY ("articleTagId", "articleId"))'
    )
    await queryRunner.query(
      'CREATE INDEX "IDX_8f7169ad0e33cda9f2baf800cd" ON "article_tag_articles_article" ("articleTagId") '
    )
    await queryRunner.query(
      'CREATE INDEX "IDX_a09234a21b0e4a186bcc08216d" ON "article_tag_articles_article" ("articleId") '
    )
    await queryRunner.query('ALTER TABLE "user_comment" DROP COLUMN "authorId"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "content"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "status"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "views"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "shares"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "reviewComment"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "createdById"')
    await queryRunner.query('ALTER TABLE "user_comment" ADD "createdById" uuid')
    await queryRunner.query(
      'ALTER TABLE "user_comment" ADD "replyToId" integer'
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD "content" character varying NOT NULL'
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD "status" character varying DEFAULT \'pending\''
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD "views" integer DEFAULT \'0\''
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD "shares" integer DEFAULT \'0\''
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD "reviewComment" character varying'
    )
    await queryRunner.query('ALTER TABLE "article" ADD "createdById" uuid')
    await queryRunner.query('ALTER TABLE "article" ADD "authorId" uuid')
    await queryRunner.query('COMMENT ON COLUMN "user_comment"."votes" IS NULL')
    await queryRunner.query(
      'ALTER TABLE "user_comment" ALTER COLUMN "votes" SET DEFAULT \'0\''
    )
    await queryRunner.query(
      'ALTER TABLE "article" ALTER COLUMN "votes" SET NOT NULL'
    )
    await queryRunner.query(
      'ALTER TABLE "article" ALTER COLUMN "votes" DROP DEFAULT'
    )
    await queryRunner.query(
      'ALTER TABLE "user_comment" ADD CONSTRAINT "FK_a1e7c2470588154415ce0b1d9fe" FOREIGN KEY ("createdById") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
    )
    await queryRunner.query(
      'ALTER TABLE "user_comment" ADD CONSTRAINT "FK_0f3902d2d0144f517fb46cbdd9f" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
    )
    await queryRunner.query(
      'ALTER TABLE "user_comment" ADD CONSTRAINT "FK_2ae796e94ef5d41e414d036397f" FOREIGN KEY ("replyToId") REFERENCES "user_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d" FOREIGN KEY ("createdById") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
    )
    await queryRunner.query(
      'ALTER TABLE "article_tag_articles_article" ADD CONSTRAINT "FK_8f7169ad0e33cda9f2baf800cd0" FOREIGN KEY ("articleTagId") REFERENCES "article_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
    )
    await queryRunner.query(
      'ALTER TABLE "article_tag_articles_article" ADD CONSTRAINT "FK_a09234a21b0e4a186bcc08216da" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "article_tag_articles_article" DROP CONSTRAINT "FK_a09234a21b0e4a186bcc08216da"'
    )
    await queryRunner.query(
      'ALTER TABLE "article_tag_articles_article" DROP CONSTRAINT "FK_8f7169ad0e33cda9f2baf800cd0"'
    )
    await queryRunner.query(
      'ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"'
    )
    await queryRunner.query(
      'ALTER TABLE "article" DROP CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d"'
    )
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP CONSTRAINT "FK_2ae796e94ef5d41e414d036397f"'
    )
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP CONSTRAINT "FK_0f3902d2d0144f517fb46cbdd9f"'
    )
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP CONSTRAINT "FK_a1e7c2470588154415ce0b1d9fe"'
    )
    await queryRunner.query(
      'ALTER TABLE "article" ALTER COLUMN "votes" SET DEFAULT \'0\''
    )
    await queryRunner.query(
      'ALTER TABLE "article" ALTER COLUMN "votes" DROP NOT NULL'
    )
    await queryRunner.query(
      'ALTER TABLE "user_comment" ALTER COLUMN "votes" DROP DEFAULT'
    )
    await queryRunner.query('COMMENT ON COLUMN "user_comment"."votes" IS NULL')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "authorId"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "createdById"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "reviewComment"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "shares"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "views"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "status"')
    await queryRunner.query('ALTER TABLE "article" DROP COLUMN "content"')
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP COLUMN "replyToId"'
    )
    await queryRunner.query(
      'ALTER TABLE "user_comment" DROP COLUMN "createdById"'
    )
    await queryRunner.query('ALTER TABLE "article" ADD "createdById" uuid')
    await queryRunner.query(
      'ALTER TABLE "article" ADD "reviewComment" character varying'
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD "shares" integer DEFAULT \'0\''
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD "views" integer DEFAULT \'0\''
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD "status" character varying DEFAULT \'pending\''
    )
    await queryRunner.query(
      'ALTER TABLE "article" ADD "content" character varying NOT NULL'
    )
    await queryRunner.query('ALTER TABLE "user_comment" ADD "authorId" uuid')
    await queryRunner.query('DROP INDEX "IDX_a09234a21b0e4a186bcc08216d"')
    await queryRunner.query('DROP INDEX "IDX_8f7169ad0e33cda9f2baf800cd"')
    await queryRunner.query('DROP TABLE "article_tag_articles_article"')
    await queryRunner.query('DROP TABLE "article"')
    await queryRunner.query('DROP TABLE "article_tag"')
    await queryRunner.query(
      'ALTER TABLE "user_comment" ADD CONSTRAINT "FK_19d0406f821caa3149825fe9693" FOREIGN KEY ("authorId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
    )
  }
}
