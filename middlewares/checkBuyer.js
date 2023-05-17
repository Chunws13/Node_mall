module.exports = async(req, res, next) => {
    const { userType } = res.locals.user;
    if (userType !== "buyer") {
        return res.status(400).json({ errorMessage: "구매자만 이용 가능한 서비스입니다." });
    }

    next();
};