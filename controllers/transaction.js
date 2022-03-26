const Transaction = require("../models/transaction");
const Ruleset = require("../models/ruleset");

exports.createTransactions = (req, res, next) => {
    const date = req.body.date;
    const transaction_id = req.body.id;
    const customer_id = req.body.customerId;
    let amount = 0;

    let customer_eligibility = 0;
    let ruleset_id = null;
    let cashback_count = 0;
    let remaining_budget = 0;

    Transaction.getCustomerTransactionCountForRuleset(customer_id, date)
        .then(([transResult, fieldData]) => {
            customer_eligibility = transResult[0].eligibility;
            console.log("eligibility check");

            Ruleset.getRedemptionLimitForTrans(date)
                .then(([result, fieldData]) => {
                    if (result.length !== 0) {
                        ruleset_id = result[0].id;
                    }

                    if (result.length !== 0 && result[0].redemption <= result[0].cashback_count) {
                        return res.status(400).json({
                            response: "Redemption Limit Exceeded, Try Again Later"
                        });
                    }

                    if (result.length !== 0 && result[0].redemption > result[0].cashback_count && customer_eligibility > result[0].min_transaction) {
                        console.log("HIIT 3: " + ++result[0].cashback_count);
                        cashback_count = ++result[0].cashback_count;
                        amount = result[0].cashback;
                        remaining_budget = result[0].remaning_budget;
                        console.log("redemption limit check");

                        if (result[0].remaning_budget > amount) {
                            remaining_budget = result[0].remaning_budget - amount;
                            console.log("budget check");
                        } else {
                            return res.status(400).json({
                                response: "Budget Limit Exceeded, Try Again Later"
                            });
                        }
                        Ruleset.updateCashbackCountAndBudget(ruleset_id, cashback_count, remaining_budget);
                        console.log("updateCashbackCountAndBudget update");
                    }

                    transaction = new Transaction(
                        null,
                        transaction_id,
                        date,
                        customer_id,
                        amount,
                        ruleset_id
                    );

                    transaction.createTransaction().then(([result2, fieldData]) => {
                        res.status(201).json({
                            response: "OK"
                        });
                    })
                        .catch(err => {
                            if (!err.statusCode) {
                                err.statusCode = 500;
                            }
                            next(err);
                        })
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};