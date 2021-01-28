const validator = require("validator");

const Url = require("../models/url");

const Redirect = async (req, res) => {
  const { shortCode } = req.params;

  if (!shortCode)
    return res.status(400).json({ msg: "short code not provided" });

  try {
    const URL = await Url.findOne({ shortCode });
    if (!URL) return res.status(400).json({ msg: "invalid url id" });
    return res.redirect(URL.url);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "some error occured" });
  }
};

const generateShortCode = (numberOfChar) => {
  let shortCode = [...Array(numberOfChar)]
    .map((i) => (~~(Math.random() * 36)).toString(36))
    .join("");
  return shortCode;
};

const checkShortCodeAvailable = async (shortCode, res) => {
  try {
    let URL = await Url.findOne({ shortCode });
    if (URL) return false;
    return true;
  } catch (e) {
    console.error(error);
    return res.status(500).json({ msg: "some error occured" });
  }
};

const checkShortCodeMinLength = (shortCode, minLength) => {
  return shortCode.length >= minLength;
};

const AddUrl = async (req, res) => {
  const { url, userShortCode } = req.body;

  if (!url) return res.status(400).json({ msg: "url not provided" });

  if (
    !validator.isURL(url, {
      require_protocol: true,
    })
  )
    return res.status(400).json({ msg: "invalid url" });

  if (userShortCode) {
    if (!checkShortCodeMinLength(4))
      return res
        .status(400)
        .json({
          msg: "short code provided must be at least 4 characters long",
        });
    let shortCodeAvailable = await checkShortCodeAvailable(userShortCode, res);
    if (!shortCodeAvailable) return res.status(400).json({ msg: "short code is not available" })
  }

  try {
    let URL = await Url.findOne({ url });
    if (!URL) {
      let newURL = new Url({ url : url , shortCode : userShortCode ? userShortCode : generateShortCode(6) });
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
