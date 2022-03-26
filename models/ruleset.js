const db = require("../util/db");

module.exports = class Ruleset {
    constructor(id, start_date, end_date, cashback, redemption, min_transaction, budget, remaning_budget) {
        this.id = id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.cashback = cashback;
        this.redemption = redemption;
        this.min_transaction = min_transaction;
        this.budget = budget;
        this.remaning_budget = remaning_budget;
    }

    static getCashbackForAllRulesets() {
        return db.execute(
            "SELECT `transaction`.`transaction_id`, FORMAT(`ruleset`.`cashback`, 2) AS `amount` FROM `trans`.`transaction`, `trans`.`ruleset`" +
            " WHERE `transaction`.`date` BETWEEN `ruleset`.`start_date` AND `ruleset`.`end_date` ORDER BY `transaction`.`transaction_id` ASC"
        )
    }

    static getRedemptionLimitForTrans(date) {
        return db.execute(
            "SELECT `ruleset`.`id`, `ruleset`.`redemption`, `ruleset`.`cashback_count`, `ruleset`.`cashback`, `ruleset`.`remaning_budget`, `ruleset`.`min_transaction` FROM `trans`.`ruleset`" +
            " WHERE ? BETWEEN `ruleset`.`start_date` AND `ruleset`.`end_date`",
            [date]
        )
    }

    static updateCashbackCountAndBudget(id, cashback_count, remaning_budget) {
        return db.execute(
            "UPDATE `trans`.`ruleset`SET `cashback_count`= ?, `remaning_budget`=? WHERE `id`= ?",
            [cashback_count, remaning_budget, id]
        )
    }

    createRuleset() {
        return db.execute(
            "INSERT INTO `trans`.`ruleset` (`start_date`,`end_date`, `cashback`,`redemption`, `min_transaction`, `budget`, `remaning_budget`)" +
            " VALUES (?,?,?,?,?,?,?) ",
            [
                this.start_date,
                this.end_date,
                this.cashback,
                this.redemption,
                this.min_transaction,
                this.budget,
                this.remaning_budget
            ]
        )
    }
}