var express = require('express');
const meme_repo = require("../repository");
const {is_valid_link, is_valid_desc, remove_undef} = require("../utils");
var router = express.Router();

// READ
router.get('/', async function(req, res) {
  const items = await meme_repo.read();
  res.setHeader('Content-Type','application/json')
  res.send(items);
});
// TODO
router.get('/:memeId', async (req, res) => {
    const item = await meme_repo.read_item(req.params.memeId);
    res.setHeader('Content-Type','application/json')
    if (item == null) return res.send({"err": "MemeId not found"})
    res.send(item);

});
const linkdesc_err = {"err": "Invalid link/description"}
// CREATE
router.post('/', (req, res) => {
    const {link, description} = req.body
    if (is_valid_link(link) && is_valid_desc(description)) return meme_repo.create({link, description}).then((x) => res.send(x))
    return res.status(400).send(linkdesc_err);
});
const check_success = (x) => {
    if(x.matchedCount == 0) return {"err": "MemeId not found"}
    return x
}
// UPDATE
router.put('/:memeId', (req, res) => {
    const {link, description} = req.body
    if (is_valid_link(link) && is_valid_desc(description)) return meme_repo.update(req.params.memeId, {link, description})
        .then(check_success).then(x => res.send(x))
    return res.status(400).send(linkdesc_err);
});
router.put('/:memeId/upvote', (req, res) => {
    meme_repo.upvote(req.params.memeId).then(check_success).then(x => res.send(x))
});
router.put('/:memeId/downvote', (req, res) => {
    meme_repo.downvote(req.params.memeId).then(check_success).then(x => res.send(x))
});

// DELETE
router.delete('/', async (req, res) => {
    meme_repo.delete_all().then(check_success).then(x => res.send(x)).catch(() => res.status(500).send())
});
router.delete('/:memeId', async (req, res) => {
    meme_repo.delete_item(req.params.memeId).then(x => res.send(x)).catch(() => res.status(500).send())
});

module.exports = router;
