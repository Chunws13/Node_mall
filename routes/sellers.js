const express = require("express");
const { Users, Products } = require('../models');
const checkLogin = require('../middlewares/checkLogin.js');
const checkSeller = require('../middlewares/checkSeller.js');
const e = require("express");
const router = express.Router();

// 판매자별 등록 상품 조회
router.get('/seller', checkLogin, checkSeller, async(req, res) => {
    try {
        const { userId } = res.locals.user;

        const userProducts = await Products.findAll({
            attributes: ["productsId", "productName", "productAmount", "productPrice", "productLink", "hits", "createdAt"],
            where: { userId },
            order: [
                ["createdAt", "DESC"]
            ]
        });

        return res.status(200).json({ userProducts });

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});

// 상품 업로드
router.post('/seller/upload', checkLogin, checkSeller, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { productName, productAmount, productPrice, productLink } = req.body;

        if (!productName || !productAmount || !productLink || !productPrice) {
            return res.status(400).json({ errorMessage: "상품 정보를 정확하게 등록 해주세요" });
        }

        const existProcuct = await Products.findOne({
            attributes: ["productName"],
            where: { productName }
        });
        if (existProcuct) {
            return res.status(400).json({ errorMessage: "이미 사용중인 상품 이름입니다." });
        }

        await Products.create({ userId, productAmount, productLink, productPrice, productName, hits: 0 })
        return res.status(200).json({ message: "상품이 등록되었습니다." });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorMessage: "상품 등록 실패" });
    }
});

// 상품 상세 조회
router.get('/seller/:productsId', checkLogin, checkSeller, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { productsId } = req.params;

        const userProducts = await Products.findOne({
            attributes: ["productName", "productAmount", "productPrice", "productLink", "hits", "createdAt", "updatedAt"],
            where: { productsId }
        });

        return res.status(200).json({ userProducts });

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});

// 상품 수량 & 금액 수정
router.put('/seller/:productsId', checkLogin, checkSeller, async(req, res) => {
    try {
        const { productsId } = req.params;
        const { newAmount, newPrice } = req.body;

        await Products.update({ productAmount: newAmount, productPrice: newPrice }, {
            where: { productsId }
        });

        return res.status(200).json({ message: "상품이 수정되었습니다." });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorMessage: "상품 수정 실패" });
    }
})

// 상품 삭제
router.delete('/api/seller/:productId', checkLogin, checkSeller, async(req, res) => {
    try {
        const { productId } = req.params;
        await Products.destroy({
            where: { productId }
        })
        return res.status(200).json({ message: "상품이 삭제되었습니다." });

    } catch (error) {
        return res.status(400).json({ errorMessage: "상품 삭제 실패" });
    }

})
module.exports = router;