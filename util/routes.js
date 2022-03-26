const express = require("express");

const rulesetController = require("../controllers/ruleset");
const transactionController = require("../controllers/transaction");

const router = express.Router();

//Get
router.get(
    "/cashback",
    rulesetController.getCashbackForAllRulesets
);

//Post
router.post(
    "/ruleset",
    rulesetController.createRulesets
);

router.post(
    "/transaction",
    transactionController.createTransactions
);

module.exports = router;
