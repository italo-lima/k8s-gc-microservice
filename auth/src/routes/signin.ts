import {Router, Request, Response} from "express"
import { body } from "express-validator"
import { sign } from "jsonwebtoken"
import { BadRequestError, validateRequest } from '@sgtickets-italo/common'

import { User } from "../models/user"
import { Password } from "../services/password"

const router = Router()

router.post(
  '/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must suppy a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials')
    }

    const passwordMatch = await Password.compare(existingUser.password, password)

    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials')
    }

    const userJwt = sign(
      {
        id: existingUser.id,
        email: existingUser.email
      },
        process.env.JWT_KEY!
    )
    
    req.session = {
      jwt: userJwt
    }
    

  res.status(200).send(existingUser)
})

export { router as signinRouter }