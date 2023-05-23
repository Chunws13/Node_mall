const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/checkLogin.js");
const checkBuyer = require("../middlewares/checkBuyer.js");
const { Products, Carts, Users } = require('../models/index.js');

/**
 * @swagger
 * paths:
 *  /api/buyer:
 *      post:
 *          summary: "구매자의 전체 상품 조회"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *          responses:
 *              "200":
 *                  description: "정상 조회"
 * 
 *              "400":
 *                  description: "조회 실패"
 */

// 구매자의 전체 상품 조회
router.post('/buyer', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { userId } = res.locals.user; //전체 상품을 조회하려면?

        const AllProducts = await Products.findAll({
            attributes: ["productsId", "productName", "productAmount", "productPrice", "productLink", "hits", "createdAt"],
            //where: { userId },
            include: [{
                model: Users,
                attributes: ['userId']
            }],
            order: [
                ["createdAt", "DESC"]
            ]
        });

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        })

        return res.status(200).json({ AllProducts, userName, userType });

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});

/**
 * @swagger
 * paths:
 *  /api/buyer/:productsId/detail
 *      post:
 *          summary: "상품 상세 조회"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 * 
 *          responses:
 *              "200":
 *                  description: "제품 상세 페이지 정상 조회"
 *              "400":
 *                  description: "제품 상세 페이지 조회 실패"
 */

// 상품 상세 조회
router.post('/buyer/:productsId/detail', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { productsId } = req.params;


        const ProductDetail = await Products.findOne({
            attributes: ["productName", "productAmount", "productPrice", "productLink", "hits", "createdAt", "updatedAt"],
            where: { productsId }
        });

        await Products.update({ hits: ProductDetail.hits + 1 }, {
            where: { productsId }
        });

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        })

        return res.status(200).json({ ProductDetail, userName, userType });

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});

/**
 * @swagger
 * paths:
 *  /api/buyer/cart:
 *      post:
 *          summary: "구매자의 장바구니 조회"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *          responses:
 *              "200":
 *                  description: "정상 조회"
 * 
 *              "400":
 *                  description: "조회 실패"
 */

// 구매자의 장바구니 조회
router.post('/buyer/cart', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { userId } = res.locals.user;

        const allProductsIdInCarts = await Carts.findAll({
            attributes: ["cartsId", "productsId", "productAmount", "createdAt"],
            where: { userId },
            include: [{
                model: Products,
                attributes: ["productName", "productPrice", "productAmount", "productLink"]
            }],
            order: [
                ["createdAt", "DESC"]
            ]

        });

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        })

        return res.status(200).json({ allProductsIdInCarts, userName, userType });

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});

/**
 * @swagger
 * paths:
 *  /api/buyer/:productsId/cart:
 *      post:
 *          summary: "장바구니 등록"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *                              productAmount:
 *                                  type: integer
 * 
 *          responses:
 *              "200":
 *                  description: "장바구니 등록 완료"
 *              "412":
 *                  description: "장바구니에 있는 productsID와 중복"
 *              "400":
 *                  description: "장바구니 등록 실패"
 * 
 * 
 *      put:
 *          summary: "장바구니 상품 수량 수정"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *                              newAmount:
 *                                  type: integer
 * 
 *          responses:
 *              "200":
 *                  description: "장바구니 제품 수량 수정 성공"
 *              "400":
 *                  description: "장바구니 제품 수량 수정 실패"
 */

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

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        })

        if (existProcuctInCart) {
            return res.status(400).json({ errorMessage: "이미 장바구니에 있는 상품 입니다." });
        } //

        await Carts.create({ userId, productsId, productAmount })
        return res.status(200).json({ message: "장바구니에 등록되었습니다.", userName, userType });

    } catch (error) {
        return res.status(400).json({ errorMessage: "장바구니 등록 실패" });
    }
});

// 장바구니 상품 수량 수정
router.put('/buyer/:productsId/cart', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { productsId } = req.params;
        const { newAmount } = req.body;

        await Carts.update({ productAmount: newAmount, updatedAt: new Date() }, {
            where: { productsId }
        });

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        })

        return res.status(200).json({ message: "해당 제품의 수량이 수정되었습니다.", userName, userType });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorMessage: "수량 수정 실패" });
    }
})

/**
 * @swagger
 * paths:
 *  /api/buyer/:cartId:
 *      delete:
 *          summary: "구매자의 장바구니 삭제"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 * 
 *          responses:
 *              "200":
 *                  description: "삭제 성공"
 *              "400":
 *                  description: "삭제 실패"
 */

// 장바구니 삭제
router.delete('/buyer/:cartsId', checkLogin, checkBuyer, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { cartsId } = req.params;
        await Carts.destroy({
            where: { cartsId }
        });

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        });

        return res.status(200).json({ message: "상품이 삭제되었습니다.", userName, userType });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorMessage: "상품 삭제 실패" });
    }
})

module.exports = router;