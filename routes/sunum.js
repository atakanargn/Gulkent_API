const router = require('express').Router();
const Customer = require('../model/Customer');
const Card = require('../model/Card');
const CardType = require('../model/CardType');
const Hes = require('../model/Hes');
const transportReport = require('../model/TransportReport')
const budgetReport = require('../model/BudgetReport')

function addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}

// Read specific Customer by customer_id
router.get('/val', async (req, res) => {
    try {
        const customer = await Customer.findOne({ card_uid: req.query.uid });
        
        if (customer == null) {
            return res.status(200).send("2,GECERSIZ");
        }

        const cardType = await CardType.findOne({ card_type: customer['card_type'].toUpperCase() });

        const dusecekMiktar = customer['budget'] - cardType['fee'];
        
        const report = new transportReport({
            customer_id:customer['customer_id'],
            tc_no:customer['tc_no'],
            first_name:customer['first_name'],
            surname:customer['surname'],
            fee:cardType['fee'],
            prevBudget:customer['budget'],
            lastBudget:dusecekMiktar,
            deviceId:'32VAL0001',
            line:'9',
            station:'OTOGAR'
        });
        
        if(cardType['fee']==0){
            report.save();
            if(cardType['card_type'].toUpperCase().includes('PERSONEL')){
                return res.status(200).send("4," + cardType['card_type'].toUpperCase() + ", ");
            }
            return res.status(200).send("4," + cardType['card_type'].toUpperCase() + ", ");
        }

        if (dusecekMiktar < 0) {
            return res.status(200).send("0," + cardType['card_type'].toUpperCase() + ",BAKIYE : " + customer['budget']);
        } else {
            customer['budget'] = dusecekMiktar;
            customer.save();
            report.save();
            if(cardType['card_type'].toUpperCase().includes('PERSONEL')){
                return res.status(200).send("4," + cardType['card_type'].toUpperCase() + ",BAKIYE : " + customer['budget']);
            }
            return res.status(200).send("1," + cardType['card_type'].toUpperCase() + ",BAKIYE : " + customer['budget']);
        }

    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Read specific hes by hes
router.get('/hes', async(req, res) => {
    try {
        const Hess = await Hes.findOne({ hes: req.query.hes });
        res.json(parseInt(Hess['status']));
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

// Bakiye yukleme ve Vize yapma
router.get('/pos', async(req, res) => {
    try {
        if(Object.keys(req.query).length==0){
            return res.status(400).send({bakiye:"",durum:"2"})  
        }

        const customer = await Customer.findOne({card_uid: req.query.uid});

        const report = new budgetReport({
            customer_id:customer['customer_id'],
            tc_no:customer['tc_no'],
            first_name:customer['first_name'],
            surname:customer['surname'],
            prevBudget:customer['budget'],
            lastBudget:customer['budget'] + parseFloat(req.query.yuklenen),
            loadBudget:parseFloat(req.query.yuklenen),
            deviceId:'32POS0001'
        });

        customer['budget'] = customer['budget'] + parseFloat(req.query.yuklenen);

        
        await Customer.updateOne({ card_uid: req.query.uid }, { $set: { budget: customer['budget'] } });
        await report.save();
        return res.status(200).send({bakiye:customer['budget'].toString(),durum:"1"})
    } catch (err) {
        console.log(err);
        res.json({bakiye:"",durum:"2"});
    }
});

// Kart Ekleme
router.get('/kart_ekle', async(req, res) => {
    try {
        const Cards = await Card.find({ uid: req.query.uid });

        if(Object.keys(Cards).length>=1){
            return res.status(400).send({message:"Kart zaten sistemde kayıtlı.",durum:"2"})  
        }

        const card = new Card({
            uid: req.query.uid
        });
    
        await card.save();
        return res.status(200).send({message:"Kart eklendi.",durum:"1"})
    } catch (err) {
        console.log(err);
        return res.status(400).send({message:err.toString(),durum:"0"}) 
    }
});

router.get('/vize_yap', async(req,res)=>{
    try{
        let customer = await Customer.findOne({ card_uid: req.query.uid });

        const date = new Date();
        let cardTypeGetted = await CardType.find({ card_type: customer['card_type'] });
        const visa_time = (cardTypeGetted[0]['visa_time'] == 0) ? addDays(date, 3650) : addDays(date, cardTypeGetted[0]['visa_time']);
        
        customer['card_visa'] = visa_time;
        await customer.save();
        return res.status(200).send({vize_tarihi:visa_time,durum:"1"})
    }catch(err){
        return res.status(400).send({error:"Müşteri mevcut değil.",durum:"2"})
    }
});

module.exports = router;