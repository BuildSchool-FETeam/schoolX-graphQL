import {MigrationInterface, QueryRunner} from "typeorm";

export class changeColumn1618210914397 implements MigrationInterface {
    name = 'changeColumn1618210914397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission_set" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "admin_user" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "instructor" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "levels"`);
        await queryRunner.query(`ALTER TABLE "course" ADD "levels" character varying DEFAULT 'Beginner'`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "score" integer DEFAULT '10'`);
        await queryRunner.query(`ALTER TABLE "permission_set" ADD CONSTRAINT "FK_29cd99f4a2fedff1cb74935c6a7" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_user" ADD CONSTRAINT "FK_ce2c117e51b3704f924a325e268" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "instructor" ADD CONSTRAINT "FK_ce6e86bd3994debeedb4e37e050" FOREIGN KEY ("createdById") REFERENCES "admin_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instructor" DROP CONSTRAINT "FK_ce6e86bd3994debeedb4e37e050"`);
        await queryRunner.query(`ALTER TABLE "admin_user" DROP CONSTRAINT "FK_ce2c117e51b3704f924a325e268"`);
        await queryRunner.query(`ALTER TABLE "permission_set" DROP CONSTRAINT "FK_29cd99f4a2fedff1cb74935c6a7"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "score" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "levels"`);
        await queryRunner.query(`ALTER TABLE "course" ADD "levels" integer`);
        await queryRunner.query(`ALTER TABLE "instructor" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "admin_user" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "permission_set" DROP COLUMN "createdById"`);
    }

}
