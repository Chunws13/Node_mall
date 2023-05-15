const express = require("express");
const { Users, Products } = require('../models');
const checkLogin = require('../middlewares/checkLogin.js');
const router = express.Router();

// 판매자별 등록 상품 조회
router.get('/seller', checkLogin, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const userProducts = await Products.find({ where: { userId } });
        return res.status(200).json({ userProducts })

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});


// 상품 업로드
router.post('/seller/upload', checkLogin, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { productName, productAmount, produckLink } = req.body;

        if (!productName || !productAmount || !produckLink) {
            return res.status(400).json({ errorMessage: "상품 정보를 정확하게 등록 해주세요" });
        }

        const existProcuct = await Products.findOne({ where: { productName } });
        if (existProcuct) {
            return res.status(400).json({ errorMessage: "이미 사용중인 상품 이름입니다." });
        }

        await Products.create({ userId, productAmount, produckLink, productName, hits: 0 })
        return res.status(200).json({ message: "상품이 등록되었습니다." });

    } catch (error) {
        return res.status(400).json({ errorMessage: "상품 등록 실패" });
    }
});

module.exports = router;