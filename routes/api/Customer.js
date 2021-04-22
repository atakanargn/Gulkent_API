const router = require('express').Router();

const Customer = require('../../model/Customer');
const Card = require('../../model/Card');
const CardType = require('../../model/CardType');

function addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}

// Create new Customer
router.post('/', async (req, res) => {
    try {
        // TC Kimlik numarası kayıtlı mı?
        let tcCount = await Customer.find({ tc_no: req.body.tc_no });
        let tcExist = (Object.keys(tcCount).length > 0);
        if (tcExist) return res.status(400).send({ error: "TC Kimlik numarası kayıtlı!" });

        let cardTypeGetted = await CardType.find({ card_type: req.body.card_type.toUpperCase() });
        let cardTypeExist = (Object.keys(cardTypeGetted).length == 0);
        if (cardTypeExist) return res.status(400).send({ error: "Girilen kart tipi mevcut değil!" });

        let cardUID = await Card.find({ uid: req.body.card_uid });
        let status = cardUID[0]['status'];
        if (status == 1) return res.status(400).send({ error: "Kart başkasına ait!" });

        const updatedCard = await Card.updateOne({ uid: req.body.card_uid }, { $set: { status: 1 } });

        let CustomerID = "CUS32" + Math.random().toString(32).substring(2).slice(0, 6).toUpperCase();
        let uidCount = await Customer.find({ customer_id: CustomerID });
        let uidExist = Object.keys(uidCount).length > 0
        while (uidExist) {
            let CustomerID = "CUS32" + Math.random().toString(32).substring(2).slice(0, 6).toUpperCase();
            let uidCount = await Customer.find({ customer_id: CustomerID });
            let uidExist = Object.keys(uidCount).length > 0
        }

        const date = new Date();
        const visa_time = (cardTypeGetted[0]['visa_time'] == 0) ? addDays(date, 3650) : addDays(date, cardTypeGetted[0]['visa_time']);

        const customer = new Customer({
            customer_id: CustomerID,
            tc_no: req.body.tc_no,
            first_name: req.body.first_name,
            surname: req.body.surname,
            phone: req.body.phone,
            email: req.body.email,
            birthDate: req.body.birthDate,
            discountDocument: req.body.discountDocument,
            card_type: req.body.card_type.toUpperCase(),
            card_uid: req.body.card_uid,
            card_visa: visa_time
        });

        const savedCustomer = await customer.save();
        res.send(savedCustomer);
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: err });
    }
});

// Read all Customers
router.get('/', async (req, res) => {
    try {
        const Customers = await Customer.find();
        res.json(Customers);
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Read specific Customer by customer_id
router.get('/:customer_id', async (req, res) => {
    try {
        const Customers = await Customer.find({ customer_id: req.params.customer_id });
        res.json(Customers);
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// TODO Put ve Patch metodları üzerine çalışılacak, filtreleme, arama, vs...

// Delete Customer by customer_id
router.delete('/:customer_id', async (req, res) => {
    try {
        const Customers = await Customer.remove({ customer_id: req.params.customer_id });
        res.status(200).send({ message: "Müşteri silindi.", uid: req.params.uid });
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Delete all cards
router.delete('/', async (req, res) => {
    try {
        const Customers = await Customer.remove();
        res.status(200).send({ message: "Müşteriler silindi." })
    } catch (err) {
        console.log(err);
        await res.status(400).send({ message: err });
    }
});

module.exports = router;