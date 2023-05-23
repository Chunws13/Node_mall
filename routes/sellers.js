const express = require("express");
const { Users, Products } = require('../models');
const checkLogin = require('../middlewares/checkLogin.js');
const checkSeller = require('../middlewares/checkSeller.js');
const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/seller:
 *      post:
 *          summary: "판매자 아이디별 등록한 상품 조회"
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

// 판매자별 등록 상품 조회
router.post('/seller', checkLogin, checkSeller, async(req, res) => {
    try {
        const { userId } = res.locals.user;

        const userProducts = await Products.findAll({
            attributes: ["productsId", "productName", "productAmount", "productPrice", "productLink", "hits", "createdAt"],
            where: { userId },
            order: [
                ["createdAt", "DESC"]
            ]
        });

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        })

        return res.status(200).json({ userProducts, userName, userType });

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});

/**
 * @swagger
 * paths:
 *  /api/seller/upload:
 *      post:
 *          summary: "판매 상품 등록"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *                              productName:
 *                                  type: string
 *                              productAmount:
 *                                  type: integer
 *                              productPrice:
 *                                  type: integer
 *                              productLink:
 *                                  type: string
 * 
 *          responses:
 *              "200":
 *                  description: "정상 등록 완료"
 *              "412":
 *                  description: "이름, 수량, 가격, 이미지 링크 중 1개 이상 누락"
 *              "400":
 *                  description: "상품 등록 실패"
 */

// 상품 업로드
router.post('/seller/upload', checkLogin, checkSeller, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { productName, productAmount, productPrice, productLink } = req.body;

        if (!productName || !productAmount || !productLink || !productPrice) {
            return res.status(412).json({ errorMessage: "상품 정보를 정확하게 등록 해주세요" });
        }

        const existProcuct = await Products.findOne({
            attributes: ["productName"],
            where: { productName }
        });

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        })

        if (existProcuct) {
            return res.status(400).json({ errorMessage: "이미 사용중인 상품 이름입니다." });
        }

        await Products.create({ userId, productAmount, productLink, productPrice, productName, hits: 0 })
        return res.status(200).json({ message: "상품이 등록되었습니다.", userName, userType });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorMessage: "상품 등록 실패" });
    }
});

/**
 * @swagger
 * paths:
 *  /api/seller/:productsId:
 *      post:
 *          summary: "판매 상품 상세 조회"
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
 * 
 *      put:
 *          summary: "판매 상품 금액 및 수량 수정"
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
 *                              newPrice:
 *                                  type: integer
 * 
 *          responses:
 *              "200":
 *                  description: "제품 정보 정상 수정"
 *              "400":
 *                  description: "제품 정보 수정 실패"
 * 
 * 
 *      delete:
 *          summary: "판매 상품 삭제"
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

// 내가 등록한 상품 상세 조회
router.post('/seller/:productsId', checkLogin, checkSeller, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { productsId } = req.params;

        const userProducts = await Products.findOne({
            attributes: ["productName", "productAmount", "productPrice", "productLink", "hits", "createdAt", "updatedAt"],
            where: { productsId }
        });

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        })

        return res.status(200).json({ userProducts, userName, userType });

    } catch (error) {
        return res.status(400).json({ errorMessage: "페이지 로드 실패" });
    }
});

// 상품 수량 & 금액 수정
router.put('/seller/:productsId', checkLogin, checkSeller, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { productsId } = req.params;
        const { newAmount, newPrice } = req.body;

        await Products.update({ productAmount: newAmount, productPrice: newPrice }, {
            where: { productsId }
        });

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        });

        return res.status(200).json({ message: "상품이 수정되었습니다.", userName, userType });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ errorMessage: "상품 수정 실패" });
    }
})

// 상품 삭제
router.delete('/seller/:productsId', checkLogin, checkSeller, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { productsId } = req.params;
        await Products.destroy({
            where: { productsId }
        });

        const { userName, userType } = await Users.findOne({
            attributes: ["userName", "userType"],
            where: { userId }
        });

        return res.status(200).json({ message: "상품이 삭제되었습니다.", userName, userType });

    } catch (error) {
        return res.status(400).json({ errorMessage: "상품 삭제 실패" });
    }

})
module.exports = router;