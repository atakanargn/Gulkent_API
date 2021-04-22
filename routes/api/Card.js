const router = require('express').Router();

const Card = require('../../model/Card');

// Create new card
router.post('/', async(req, res) => {
    const cards = await Card.find({uid:req.body.uid});
    
    if(Object.keys(cards).length>=1){
        return res.status(400).send({error:"Kart sistemde mevcut."})
    }

    const card = new Card({
        uid: req.body.uid
    });

    try {
        const savedCard = await card.save();
        res.send({ uid: req.body.uid });
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: err });
    }
});

// Read all cards
router.get('/', async(req, res) => {
    if(Object.keys(req.query).length>=1){
        try {
            const Cards = await Card.find({status:req.query.status});
            res.json(Cards);
        } catch (err) {
            console.log(err);
            await res.status(400).send({ error: err });
        } 
    }

    try {
        const Cards = await Card.find();
        res.json(Cards);
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Read specific card by uid
router.get('/:uid', async(req, res) => {
    try {
        const Cards = await Card.find({ uid: req.params.uid });
        res.json(Cards);
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Update card status by uid
/* 0 : Tanımsız
   1 : Tanımlı, bir müşteriye tanımlanmış
   2 : Yasaklı, Kartın kayıp olduğu bildirilmiş ya da el konulmuş.
*/
router.patch('/:uid', async(req, res) => {
    try {
        const updatedCard = await Card.updateOne({ uid: req.params.uid }, { $set: { status: req.body.status } });
        res.status(200).send({
            message: "Kart durumu güncellendi.",
            uid: req.params.uid,
            status: req.body.status
        })
    } catch (err) {
        res.json({ error: err });
    }
});

// Delete card by uid
router.delete('/:uid', async(req, res) => {
    try {
        const cardExist = await Card.findOne({ uid: req.params.uid });
        if (cardExist) {
            const Cards = await Card.remove({ uid: req.params.uid });
            res.status(200).send({ message: "Kart silindi.", uid: req.params.uid })
        } else {
            res.status(400).send({ message: "Böyle bir kart mevcut değil.", uid: req.params.uid })
        }

    } catch (err) {
        console.log(err);
        await res.status(400).send({ message: err });
    }
});

// Delete all cards
router.delete('/', async(req, res) => {
    try {
        const Cards = await Card.remove();
        res.status(200).send({ message: "Kart silindi.", uid: req.params.uid })
    } catch (err) {
        console.log(err);
        await res.status(400).send({ message: err });
    }
});

module.exports = router;