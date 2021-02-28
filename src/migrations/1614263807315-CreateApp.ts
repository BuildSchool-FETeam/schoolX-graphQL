import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateApp1614263807315 implements MigrationInterface {
    name = 'CreateApp1614263807315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission_set" ("id" SERIAL NOT NULL, "course" character varying NOT NULL, "user" character varying NOT NULL, "blog" character varying NOT NULL, "instructor" character varying NOT NULL, "permission" character varying NOT NULL, "notification" character varying NOT NULL, CONSTRAINT "PK_40c60f41127ea51a22e63d291f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("name" character varying NOT NULL, "permissionSetId" integer, CONSTRAINT "REL_af366ff26484d6faf9c15349f4" UNIQUE ("permissionSetId"), CONSTRAINT "PK_ae4578dcaed5adff96595e61660" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "admin_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying, CONSTRAINT "PK_a28028ba709cd7e5053a86857b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_af366ff26484d6faf9c15349f42" FOREIGN KEY ("permissionSetId") REFERENCES "permission_set"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_user" ADD CONSTRAINT "FK_faa5e69338cb413df6d4e4926b3" FOREIGN KEY ("role") REFERENCES "role"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_user" DROP CONSTRAINT "FK_faa5e69338cb413df6d4e4926b3"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_af366ff26484d6faf9c15349f42"`);
        await queryRunner.query(`DROP TABLE "admin_user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission_set"`);
    }

}
