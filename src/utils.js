const remove_undef = (obj) => Object.fromEntries(Object.entries(obj).filter(([_,val]) => val != undefined));
const is_valid_link = (link) => { return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(link);}
const is_valid_desc = (desc) => { return desc != undefined }

module.exports = {
    remove_undef,
    is_valid_link,
    is_valid_desc,
}
