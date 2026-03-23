import { Router } from 'express'
import transactionsRouter from './transactions.router.js'
import fundingRouter from './funding.router.js'
import { createAccount, getAllAccounts, getAccount, updateAccount, lockAccount, unlockAccount, deleteAccount } from '../../controllers/accounts/accounts.controller.js'

const router = Router()

router.use('/transactions', transactionsRouter)
router.use('/funding', fundingRouter)

router.post('/new', createAccount)
router.get('/all', getAllAccounts)
router.get('/:id', getAccount)
router.put('/update/:id', updateAccount)
router.put('/lock/:id', lockAccount)
router.put('/unlock/:id', unlockAccount)
router.delete('/delete/:id', deleteAccount)

export default router