const Ruleset = require("../models/ruleset");

//get cashback
exports.getCashbackForAllRulesets = (req, res, next) => {

    Ruleset.getCashbackForAllRulesets()
      .then(([result, fieldData]) => {
        res.status(200).json({
          message: "Successful",
          response: result
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

// create ruleset
exports.createRulesets = (req, res, next) => {
    const start_date = req.body.startDate;
    const end_date = req.body.endDate;
    const cashback = req.body.cashback;
    const redemption = req.body.redemptionLimit;
    const min_transaction = req.body.minTransactions;
    const budget = req.body.budget;

    ruleset = new Ruleset(
        null,
        start_date,
        end_date,
        cashback,
        redemption,
        min_transaction,
        budget,
        budget
    );

    ruleset.createRuleset().then(([result, fieldData]) => {
        res.status(201).json({
            response: "OK"
        });
    })
        .catch(err => {
            if (err.errno === 1406 && err.sqlState === "22001") {
                err.statusCode = 400;
            }
            if (err.errno === 1062 && err.sqlState === "23000") {
                err.statusCode = 409;
            }
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};