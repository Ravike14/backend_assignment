const db = require("../util/db");

module.exports = class Transaction {
    constructor(id, transaction_id, date, customer_id, amount, ruleset_id) {
        this.id = id;
        this.transaction_id = transaction_id;
        this.date = date;
        this.customer_id = customer_id;
        this.amount = amount;
        this.ruleset_id = ruleset_id;
    }

    static getCustomerTransactionCountForRuleset(customer_id, date) {
        return db.execute(
            "SELECT COUNT(`transaction`.`customer_id`) AS `eligibility`" +
            " FROM `trans`.`transaction`" +
            " INNER JOIN `trans`.`ruleset` ON `transaction`.`ruleset_id` = `ruleset`.`id`" +
            " WHERE `transaction`.`customer_id`= ? AND ? BETWEEN `ruleset`.`start_date` AND `ruleset`.`end_date`",
            [customer_id, date]
        )
    }

    createTransaction() {
        return db.execute(
            "INSERT INTO `trans`.`transaction` (`transaction_id`, `date`, customer_id, `amount`, ruleset_id)" +
            " VALUES (?,?,?,?,?)",
            [
                this.transaction_id,
                this.date,
                this.customer_id,
                this.amount,
                this.ruleset_id
            ]
        )
    }
}