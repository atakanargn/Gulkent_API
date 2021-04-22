const router = require('express').Router();

const CardType = require('../../model/CardType');

// Create new card_type
router.post('/', async(req, res) => {
    const cardType = new CardType({
        card_type:req.body.card_type.toUpperCase(),
        description:req.body.description,
        fee:req.body.fee,
        transfer_fee:req.body.transfer_fee,
        has_visa:req.body.has_visa,
        visa_time:req.body.visa_time
    });

    try {
        const savedCard = await cardType.save();
        res.json(savedCard);
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Read all card_types
router.get('/', async(req, res) => {
    try {
        const CardTypes = await CardType.find();
        res.json(CardTypes);
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Read specific card_types by card_type
router.get('/:card_type', async(req, res) => {
    try {
        const CardTypes = await CardType.find({ card_type: req.params.card_type.toUpperCase() });
        res.json(CardTypes);
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Update card_type properties by card_type
router.patch('/:card_type', async(req, res) => {
    try {
        const updatedCardType = await CardType.updateOne({ card_type: req.params.card_type.toUpperCase() },
        { $set: { description:req.body.description,
                  fee:req.body.fee,
                  transfer_fee:req.body.transfer_fee,
                  has_visa:req.body.has_visa,
                  visa_time:req.body.visa_time } });
        res.status(200).send({
            message: "Kart tipi güncellendi.",
            card_type: req.params.card_type.toUpperCase(),
            description:req.body.description,
            fee:req.body.fee,
            transfer_fee:req.body.transfer_fee
        })
    } catch (err) {
        console.log(err);
        res.json({ error: err });
    }
});

// Delete card_type by uid
router.delete('/:card_type', async(req, res) => {
    try {
        const cardTypeExist = await CardType.findOne({ card_type: req.params.card_type.toUpperCase() });
        if (cardTypeExist) {
            const CardTypes = await CardType.remove({ card_type: req.params.card_type.toUpperCase() });
            res.status(200).send({ message: "Kart tipi silindi.", card_type: req.params.card_type.toUpperCase() })
        } else {
            res.status(400).send({ message: "Böyle bir kart mevcut değil.", card_type: req.params.card_type.toUpperCase() })
        }

    } catch (err) {
        console.log(err);
        await res.status(400).send({ message: err });
    }
});

// Delete all card_types
router.delete('/', async(req, res) => {
    try {
        const CardTypes = await CardType.remove();
        res.status(200).send({ message: "Kart tipleri silindi." })
    } catch (err) {
        console.log(err);
        await res.status(400).send({ message: err });
    }
});

module.exports = router;