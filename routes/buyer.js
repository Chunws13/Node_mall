const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/checkLogin.js");
const checkBuyer = require("../middlewares/checkBuyer.js");
const { Products, Carts, Users } = require('../models');

// 구매자의 전체 상품 조회
router.get('/buyer', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { userId } = res.locals.user; //전체 상품을 조회하려면?

        const AllProducts = await Products.findAll({
            attributes: ["productsId", "productName", "productAmount", "productPrice", "productLink", "hits", "createdAt"],
            //where: { userId },
            include: [{
                model: Users,
                attributes: ['userName']
            }],
            order: [
                ["createdAt", "DESC"]
            ]
        });

        return res.status(200).json({ AllProducts });

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});

// 상품 상세 조회
router.get('/buyer/:productsId', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { userId } = res.locals.user; //?
        const { productsId } = req.params;

        const ProductDetail = await Products.findOne({
            attributes: ["productName", "productAmount", "productPrice", "productLink", "hits", "createdAt", "updatedAt"],
            where: { productsId }
        });

        return res.status(200).json({ ProductDetail });

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});

// 장바구니 등록
router.post('/buyer/:productsId/cart', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { productsId } = req.params;
        const { productAmount } = req.body;

        const existProcuctInCart = await Carts.findOne({
            attributes: ["productsId"],
            where: { productsId }
        });

        if (existProcuctInCart) {
            return res.status(400).json({ errorMessage: "이미 장바구니에 있는 상품 입니다." });
        } //

        //해당 프로덕트 불러오기
        // const productAmount = await Products.findOne({
        //     attributes: ["productAmount"],
        //     where: { productsId }
        // });

        // await Carts.create({ userId, productAmount, productLink, productPrice, productName, hits: 0 })
        await Carts.create({ userId, productsId, productAmount })
        return res.status(200).json({ message: "장바구니에 등록되었습니다." });

    } catch (error) {
        return res.status(400).json({ errorMessage: "장바구니 등록 실패" });
    }
});

// 장바구니 상품 수량 수정
router.put('/buyer/:productsId/cart', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { productsId } = req.params;
        const { newAmount } = req.body;

        await Carts.update({ productAmount: newAmount, updatedAt: new Date() }, {
            where: { productsId }
        });

        return res.status(200).json({ message: "해당 제품의 수량이 수정되었습니다." });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorMessage: "수량 수정 실패" });
    }
})

// 장바구니 삭제
router.delete('/api/buyer/:productId', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { productId } = req.params;
        await Carts.destroy({
            where: { productId }
        })
        return res.status(200).json({ message: "상품이 삭제되었습니다." });

    } catch (error) {
        return res.status(400).json({ errorMessage: "상품 삭제 실패" });
    }
})


module.exports = router;