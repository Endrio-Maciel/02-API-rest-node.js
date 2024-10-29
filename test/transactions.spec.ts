import {  beforeEach, it, beforeAll, afterAll, describe, expect, test } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transacitons routes', ()=>{
    
    beforeAll(async ()=>{
        
        await app.ready()
        console.log('Server is ready')
    })
    afterAll(async ()=>{
        await app.close()
    })

    beforeEach(()=>{
         execSync('npm run knex migrate:rollback --all')
         execSync('npm run knex migrate:latest')
    })
    

it('should be able to create a new transaction', async ()=>{
        await request(app.server).post('/transactions').send({
            title: 'New transactions',
            amount: 5000,
            type: 'credit',
        })
        .expect(201)   
    })

it('should be able to list all transactions', async ()=>{
        const createTransactionResponse = await request(app.server)
        .post('/transactions').send({
            title: 'New transactions',
            amount: 5000,
            type: 'credit',
        })

        const cookies = createTransactionResponse.get('Set-Cookie') || [''] 
        
        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transactions',
                amount: 5000,
            })
        ])
    })

it('should be able to get a specific transaction', async ()=>{
        const createTransactionResponse = await request(app.server)
        .post('/transactions').send({
            title: 'New transactions',
            amount: 5000,
            type: 'credit',
        })

    const cookies = createTransactionResponse.get('Set-Cookie') || [''] 
        
    const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id
    
    const getTransactionResponse = await request(app.server)
    .get(`/transactions/${transactionId}`)
    .set('Cookie', cookies)
    .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New transactions',
                amount: 5000,
            })
        )
    })
})

it.todo('should be able to get the summary', async () => {
    
    const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Credit transactions',
                amount: 5000,
                type: 'credit',
            })

    const cookies = createTransactionResponse.get('Set-Cookie') || [''];
    console.log('Cookies after creating credit transaction:', cookies);  
    await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
                title: 'Debit transactions',
                amount: 2000,
                type: 'debit',
            })
            

    const summaryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200)
            
    console.log('Summary Response Body:', summaryResponse.body);
            expect(summaryResponse.body.summary).toEqual({
            amount: 3000,
            });
    
}, 30000);


