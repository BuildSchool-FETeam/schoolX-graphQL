import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Assignment } from "./Assignment.entity";
import { TestCase } from "./Testcase.entity";

@Entity()
export class CodeChallenge extends BaseEntity{

    @ManyToOne(() => Assignment, assignment => assignment.codeChallenges, {
        onDelete: "CASCADE"
    })
    @JoinColumn()
    assignment: Assignment

    @Column()
    input: string;

    @Column()
    output: string;

    @Column()
    languageSupport: string;

    @OneToMany(() => TestCase, (testCase) => testCase.codeChallenge)
    testCases: TestCase[];
}