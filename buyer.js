const express = require("express");
const { Users, Products, Carts } = require("../models"); //
const checkLogin = require('../middlewares/checkLogin.js'); //
const checkBuyer = require('../middlewares/checkBuyer.js'); //
const jwt = require("jsonwebtoken"); 
const router = express.Router();



////전체상품조회

// 구매자의 전체 상품 조회
router.get('/buyer', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { userId } = res.locals.user; //전체 상품을 조회하려면?

        const AllProducts = await Products.findAll({
            attributes: ["productsId", "productName", "productAmount", "productPrice", "productLink", "hits", "createdAt"],
            //where: { userId },
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
router.get('/buyer/:productId', checkLogin, checkBuyer, async(req, res) => {
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




/////장바구니

// 구매자의 장바구니 조회
router.get('/buyer/cart', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { userId } = res.locals.user; 

        //1. userId의 장바구니를 불러와서, porductID와 수량(productAmount)을 불러오기
        //2. 불러온 productId를 이용해서 제품 정보 찾기 (이때 제품의 productAmount는 제품의 남은 수량임 주의)
        //3. 제품 정보 : Products의 "productsId", "productName", "productPrice", "productLink"
        //   + 제품 수량 정보 : Carts의 "productAmount" 보내주기

        // const CartsList = await Carts.findAll({
        //     attributes: ["productsId", "productAmount", "createdAt"],
        //     where: { userId },
        //     order: [
        //         ["createdAt", "DESC"]
        //     ]
        // }); 

        const AllProductsInCarts = await Products.findAll({
            attributes: ["productsId", "productName", "productAmount", "productPrice", "productLink", "hits", "createdAt"],
            where: { productsId }
        });

        return res.status(200).json({ AllProductsInCarts });

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});





// 장바구니 등록
router.post('/buyer/:productId/cart', checkLogin, checkBuyer, async(req, res) => {
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

        // await Carts.create({ userId, productAmount, productLink, productPrice, productName, hits: 0 })
        await Carts.create({ userId, productsId, productAmount })
        return res.status(200).json({ message: "장바구니에 등록되었습니다." });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorMessage: "장바구니 등록 실패" });
    }
});


// 장바구니 상품 수량 수정
router.put('/buyer/:cartId', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { cartId } = req.params;
        const { newAmount } = req.body;

        await Carts.update({ productAmount: newAmount }, {
            where: { cartId }
        });

        return res.status(200).json({ message: "해당 제품의 수량이 수정되었습니다." });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorMessage: "수량 수정 실패" });
    }
})


// 장바구니 삭제
router.delete('/api/buyer/:cartId', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { cartId } = req.params;
        await Carts.destroy({
            where: { cartId }
        })
        return res.status(200).json({ message: "상품이 삭제되었습니다." });

    } catch (error) {
        return res.status(400).json({ errorMessage: "상품 삭제 실패" });
    }

})


module.exports = router;