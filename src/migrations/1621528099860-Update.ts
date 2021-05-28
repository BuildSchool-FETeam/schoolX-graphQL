import {MigrationInterface, QueryRunner} from "typeorm";

export class Update1621528099860 implements MigrationInterface {
    name = 'Update1621528099860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_user" DROP CONSTRAINT "FK_8fcd0f004c1581eacae3871c339"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP CONSTRAINT "UQ_8fcd0f004c1581eacae3871c339"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP COLUMN "achievementId"`);
        await queryRunner.query(`ALTER TABLE "achievement" ADD "clientUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "achievement" ADD CONSTRAINT "UQ_8848b1517a0b4ed098bf1483880" UNIQUE ("clientUserId")`);
        await queryRunner.query(`ALTER TABLE "achievement" ADD CONSTRAINT "FK_8848b1517a0b4ed098bf1483880" FOREIGN KEY ("clientUserId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievement" DROP CONSTRAINT "FK_8848b1517a0b4ed098bf1483880"`);
        await queryRunner.query(`ALTER TABLE "achievement" DROP CONSTRAINT "UQ_8848b1517a0b4ed098bf1483880"`);
        await queryRunner.query(`ALTER TABLE "achievement" DROP COLUMN "clientUserId"`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD "achievementId" uuid`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD CONSTRAINT "UQ_8fcd0f004c1581eacae3871c339" UNIQUE ("achievementId")`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD CONSTRAINT "FK_8fcd0f004c1581eacae3871c339" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
