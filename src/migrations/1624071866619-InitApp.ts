import {MigrationInterface, QueryRunner} from "typeorm";

export class InitApp1624071866619 implements MigrationInterface {
    name = 'InitApp1624071866619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "views"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "shares"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "article" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" ADD "status" character varying DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "views" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "shares" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "article" ADD "authorId" uuid`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "votes" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "article"."votes" IS NULL`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "votes" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d" FOREIGN KEY ("createdById") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d"`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "votes" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "article"."votes" IS NULL`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "votes" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "shares"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "views"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "article" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "article" ADD "shares" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "views" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "status" character varying DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "article" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" ADD "authorId" uuid`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_6672400e5028d0b15bd23f4cd5d" FOREIGN KEY ("createdById") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "client_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
