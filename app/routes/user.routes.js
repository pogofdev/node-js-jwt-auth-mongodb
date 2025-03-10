const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.post("/api/test/user/mint", [authJwt.verifyToken], controller.mint);
  app.post("/api/test/user/transfer", [authJwt.verifyToken], controller.transfer);
  app.post("/api/test/user/transactions", [authJwt.verifyToken], controller.transactions);
  app.post("/api/test/user/getOwnerTickets", [authJwt.verifyToken], controller.getOwnerTickets);
  app.post("/api/test/user/getRedeemTickets", [authJwt.verifyToken], controller.getRedeemTickets);
  app.post("/api/test/user/buy", [authJwt.verifyToken], controller.buy);
  app.post("/api/test/user/use", [authJwt.verifyToken], controller.use);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
