const validator = require("validator");

const Url = require("../models/url");

const Redirect = async (req, res) => {
  const { shortCode } = req.params;

  if (!shortCode) return res.status(400).json({ msg: "short code not provided" });

  try {
    const URL = await Url.findOne({ shortCode });
    if (!URL) return res.status(400).json({ msg: "invalid url id" });
    return res.redirect(URL.url);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "some error occured" });
  }
};

const generateShortCode = () => {
    let shortCode = [...Array(6)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
    return shortCode
}

const AddUrl = async (req, res) => {
  const { url, userShortCode } = req.body;

  if (!url) return res.status(400).json({ msg: "url not provided" });

  if (
    !validator.isURL(url, {
      require_protocol: true,
    })
  )
    return res.status(400).json({ msg: "invalid url" });

  try {
    let URL = await Url.findOne({ url });
    if (!URL) {
      let newURL = new Url({ url });
      await newURL.save();
      return res.status(201).json({ shortCode: newURL.shortCode, url });
    }

    return res.status(200).json({ shortCode: URL.shortCode, url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "some error occured" });
  }
};

module.exports = {
  Redirect,
  AddUrl,
};