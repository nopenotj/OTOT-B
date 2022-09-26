var express = require('express');
const {read, create, read_item, update, upvote, downvote, delete_all, delete_item} = require("../repository");
const {is_valid_link, is_valid_desc, remove_undef} = require("../utils");
var router = express.Router();

// READ
router.get('/', async function(req, res, next) {
  const items = await read();
  res.setHeader('Content-Type','application/json')
  res.send(items);
});
// TODO
router.get('/:memeId', async (req, res) => {
    const item = await read_item(req.params.memeId);
    res.setHeader('Content-Type','application/json')
    if (item == null) return res.send({"err": "MemeId not found"})
    res.send(item);

});

// CREATE
router.post('/', (req, res) => {
    const {link, description} = req.body
    if (is_valid_link(link) && is_valid_desc(description)) return create({link, description}).then((x) => res.send(x))
    return res.status(400).send({"err": "Invalid link/description"});
});
const check_success = (x) => {
    if(x.matchedCount == 0) return {"err": "MemeId not found"}
    return x
}
// UPDATE
router.put('/:memeId', (req, res) => {
    const {link, description} = req.body
    if (is_valid_link(link) && is_valid_desc(description)) return update(req.params.memeId, {link, description})
        .then(check_success).then(x => res.send(x))
    return res.status(400).send("Invalid link/description");
});
router.put('/:memeId/upvote', (req, res) => {
    upvote(req.params.memeId).then(check_success).then(x => res.send(x))
});
router.put('/:memeId/downvote', (req, res) => {
    downvote(req.params.memeId).then(check_success).then(x => res.send(x))
});

// DELETE
router.delete('/', async (req, res) => {
    delete_all().then(check_success).then(x => res.send(x)).catch(() => res.status(500).send())
});
router.delete('/:memeId', async (req, res) => {
    delete_item(req.params.memeId).then(x => res.send(x)).catch(() => res.status(500).send())
});

module.exports = router;
