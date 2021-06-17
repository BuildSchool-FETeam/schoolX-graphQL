import {MigrationInterface, QueryRunner} from "typeorm";

export class InitApp1623858306601 implements MigrationInterface {
    name = 'InitApp1623858306601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "article" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "shortDescription" character varying NOT NULL, "content" character varying NOT NULL, "votes" integer NOT NULL DEFAULT '0', "views" integer NOT NULL DEFAULT '0', "shares" character varying NOT NULL DEFAULT '0', "authorId" uuid, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "views"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "shares"`);
        await queryRunner.query(`ALTER TABLE "user_comment" ADD "articleId" integer`);
        await queryRunner.query(`ALTER TABLE "article" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" ADD "views" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "shares" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "votes" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_comment" ADD CONSTRAINT "FK_0f3902d2d0144f517fb46cbdd9f" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`);
        await queryRunner.query(`ALTER TABLE "user_comment" DROP CONSTRAINT "FK_0f3902d2d0144f517fb46cbdd9f"`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "votes" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "shares"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "views"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "user_comment" DROP COLUMN "articleId"`);
        await queryRunner.query(`ALTER TABLE "article" ADD "shares" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "views" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "article"`);
    }

}
