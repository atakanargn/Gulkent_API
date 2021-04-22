const router = require('express').Router();

const Hes = require('../../model/Hes');

// Create new hes
router.post('/', async(req, res) => {
    const hes = new Hes({
        hes: req.body.hes,
        ad_soyad: req.body.ad_soyad,
        status: req.body.status
    });

    try {
        const savedHes = await hes.save();
        res.send({ hes: req.body.hes });
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Read all hes
router.get('/', async(req, res) => {
    try {
        const Hess = await Hes.find();
        res.json(Hess);
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Read specific hes by hes
router.get('/:hes', async(req, res) => {
    try {
        const Hess = await Card.find({ hes: req.params.hes });
        res.json(Hess);
    } catch (err) {
        console.log(err);
        await res.status(400).send({ error: err });
    }
});

// Update hes status by hes
router.patch('/:hes', async(req, res) => {
    try {
        const updatedHes = await Hes.updateOne({ uid: req.params.hes }, { $set: { status: req.body.status } });
        res.status(200).send({
            message: "Hes durumu güncellendi.",
            hes: req.params.hes,
            status: req.body.status
        })
    } catch (err) {
        res.json({ error: err });
    }
});

// Delete hes by hes
router.delete('/:hes', async(req, res) => {
    try {
        const hesExist = await Hes.findOne({ hes: req.params.hes });
        if (hesExist) {
            const Hess = await Hes.remove({ hes: req.params.hes });
            res.status(200).send({ message: "Hes silindi.", hes: req.params.hes })
        } else {
            res.status(400).send({ message: "Böyle bir hes mevcut değil.", uid: req.params.uid })
        }

    } catch (err) {
        console.log(err);
        await res.status(400).send({ message: err });
    }
});

// Delete all heses
router.delete('/', async(req, res) => {
    try {
        const Hess = await Hes.remove();
        res.status(200).send({ message: "Hesler silindi.", uid: req.params.uid })
    } catch (err) {
        console.log(err);
        await res.status(400).send({ message: err });
    }
});

module.exports = router;