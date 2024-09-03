require('dotenv').config()
const express = require('express')
const path = require('path');

const { HttpAgent, Actor } = require('@dfinity/agent');
const { idlFactory } = require('./canister_idl');
const { Principal } = require('@dfinity/principal');
const canisterId = 'x5g5e-eyaaa-aaaan-qmwda-cai';

// Buat agen HTTP untuk berinteraksi dengan IC
const agent = new HttpAgent({ host: 'https://ic0.app' });

// Buat aktor untuk canister yang ingin dibaca
const canister = Actor.createActor(idlFactory, {
    agent,
    canisterId,
});


// MIDDLEWARE =========================
const middlewareLogRequest = require('./src/middleware/logs.js');


const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE =========================
app.use(middlewareLogRequest);
app.use(express.json());
app.use("/public", express.static('public'));
// app.use(express.static("./public"));

// FIRST =========================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/nama_token', async (req, res) => {
    try {
        const icrc1_name = await canister.icrc1_name();

        console.log('icrc1_name : ', icrc1_name.toString());

        var data = icrc1_name.toString();
        res.json({
            message: "GET Nama Token Success",
            data: data,
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error.toString(),
        })
    }
})

app.get('/total_supply', async (req, res) => {
    try {
        const total_supply = await canister.total_supply();

        console.log('total_supply : ', total_supply.toString());

        var data = total_supply.toString();
        res.json({
            message: "GET Total Supply Success",
            data: data,
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error.toString(),
        })
    }
})

app.get('/balance_of/:principalIdText', async (req, res) => {
    try {
        const { principalIdText } = req.params;

        // Panggil metode pada canister
        const balance = await canister.balance_of(principalIdText);

        // Kembalikan hasil dalam format JSON
        res.json({
            message: "Balance " + principalIdText + " Success",
            balance: balance.toString(),
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error.toString(),
        });
    }
});

app.get('/claim_token/:myPrincipalIdText/:key', async (req, res) => {
    try {
        const { myPrincipalIdText, key } = req.params;
        // const myPrincipalIdText = body.principalIdText;
        // const key = body.key;

        // Panggil metode pada canister 
        const result = await canister.claim_token(myPrincipalIdText, key);

        // Kirim response
        res.json({
            message: "Claim token ke " + myPrincipalIdText + " Success",
            result: result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: error.message,
        });
    }
});



app.listen(PORT, () => {
    console.log(`🙏🏻 Server running on port ${PORT}`)
})