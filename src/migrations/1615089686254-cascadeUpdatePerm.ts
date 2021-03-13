import {MigrationInterface, QueryRunner} from "typeorm";

export class cascadeUpdatePerm1615089686254 implements MigrationInterface {
    name = 'cascadeUpdatePerm1615089686254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_af366ff26484d6faf9c15349f42"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "REL_af366ff26484d6faf9c15349f4"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "permissionSetId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "permissionSetId" integer`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "REL_af366ff26484d6faf9c15349f4" UNIQUE ("permissionSetId")`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_af366ff26484d6faf9c15349f42" FOREIGN KEY ("permissionSetId") REFERENCES "permission_set"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
