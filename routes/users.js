const express = require("express");
const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/join:
 *      post:
 *          summary: "회원 가입 정보 전달"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              userName:
 *                                  type: string
 *                              userType:
 *                                  type: string
 *                              password:
 *                                  type: string
 *          responses:
 *              "200":
 *                  description: "회원 가입 성공"
 *              "400":
 *                  description: "회원 가입 실패"
 *              "401":
 *                  description : "userName 중복"
 */

// 회원가입
router.post('/join', async(req, res) => {
    try {
        const { userName, userType, password } = req.body;
        const existUser = await Users.findOne({
            where: { userName }
        })

        // 유저가 존재하는 경우
        if (existUser) {
            return res.status(401).json({ errorMessage: "존재하는 ID 입니다." });
        }

        const newUser = await Users.create({ userName, userType, password });
        return res.status(200).json({ message: "회원가입이 완료되었습니다. " });

    } catch (error) {
        return res.status(400).json({ errorMessage: "회원 가입에 실패했습니다.", detail: error });
    }
});

/**
 * @swagger
 * paths:
 *  /api/login:
 *      post:
 *          summary: "로그인"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              userName:
 *                                  type: string
 *                              userType:
 *                                  type: string
 *                              password:
 *                                  type: string
 *          responses:
 *              "200":
 *                  description: "로그인 성공, 인증 토큰 반환"
 *              "400":
 *                  description: "로그인 실패"
 *              "412":
 *                  description: "회원 정보 불일치"
 */

router.post("/login", async(req, res) => {
    try {
        const { userName, userType, password } = req.body;
        const loginUser = await Users.findOne({
            where: { userName, userType }
        });

        // 회원 정보가 없을 때, (id 없음 or 가입 유형 다름) + 비밀번호 불일치
        if (!loginUser || password !== loginUser.password) {
            return res.status(412).json({ errorMessage: "로그인 정보를 확인해주세요." });
        }

        const token = jwt.sign({ userId: loginUser.userId }, "scerect-key");
        return res.status(200).json({ token: `Bearer ${token}` });

    } catch (error) {
        return res.status(400).json({ errorMessage: "로그인에 실패했습니다." });
    }
})



module.exports = router;