import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateNotic1620783001183 implements MigrationInterface {
    name = 'UpdateNotic1620783001183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_notification" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "recipientByRoles" character varying NOT NULL, "recipientByAdminIds" character varying NOT NULL, "createdById" uuid, CONSTRAINT "PK_d0e228b0be64aedd7ad1ca97588" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "admin_notification" ADD CONSTRAINT "FK_95abf8cf7dc7f497958939c3418" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_notification" DROP CONSTRAINT "FK_95abf8cf7dc7f497958939c3418"`);
        await queryRunner.query(`DROP TABLE "admin_notification"`);
    }

}
