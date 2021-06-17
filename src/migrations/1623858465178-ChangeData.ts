import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeData1623858465178 implements MigrationInterface {
    name = 'ChangeData1623858465178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "article_tag" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_43dc2fa69a4739ce178e021d649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_tag_articles_article" ("articleTagId" integer NOT NULL, "articleId" integer NOT NULL, CONSTRAINT "PK_b88643a956978548fa3ecea365f" PRIMARY KEY ("articleTagId", "articleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8f7169ad0e33cda9f2baf800cd" ON "article_tag_articles_article" ("articleTagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a09234a21b0e4a186bcc08216d" ON "article_tag_articles_article" ("articleId") `);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "views"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "shares"`);
        await queryRunner.query(`ALTER TABLE "article" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" ADD "views" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "shares" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "article"."votes" IS NULL`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "votes" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article_tag_articles_article" ADD CONSTRAINT "FK_8f7169ad0e33cda9f2baf800cd0" FOREIGN KEY ("articleTagId") REFERENCES "article_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_tag_articles_article" ADD CONSTRAINT "FK_a09234a21b0e4a186bcc08216da" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_tag_articles_article" DROP CONSTRAINT "FK_a09234a21b0e4a186bcc08216da"`);
        await queryRunner.query(`ALTER TABLE "article_tag_articles_article" DROP CONSTRAINT "FK_8f7169ad0e33cda9f2baf800cd0"`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "votes" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "article"."votes" IS NULL`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "shares"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "views"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "article" ADD "shares" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "views" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "IDX_a09234a21b0e4a186bcc08216d"`);
        await queryRunner.query(`DROP INDEX "IDX_8f7169ad0e33cda9f2baf800cd"`);
        await queryRunner.query(`DROP TABLE "article_tag_articles_article"`);
        await queryRunner.query(`DROP TABLE "article_tag"`);
    }

}
