const mongoose = require('mongoose');
const keys = require('../private/keys')

let reviewSchema = new mongoose.Schema({id: String, text: String, url: String, status: Number})
let review = mongoose.model('reviews', reviewSchema)


async function aggregator(socket) {
  socket.on("newReview", async function (data) {
    console.log('#newReview()', await newReview(data, socket))
    return true
  })
  socket.on("requestReviewList", async function () {
    console.log('#requestReviewList()', await requestReviewList(socket))
    return true
  })
  socket.on("approveReview", async function (id) {
    console.log('#approveReview()', await approveReview(id))
    return true
  })
  socket.on("denyReview", async function (id) {
    console.log('#denyReview()', await denyReview(id))
    return true
  })
  socket.on("revertReview", async function (id) {
    console.log('#revertReview()', await revertReview(id))
    return true
  })
  return false // Nothing happened with the socket
}


async function newReview(data, socket) {
  if(await review.countDocuments({url: data.url}) <= 0) {
    if(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(data.url)) {
      let newReview = new review({
        id: Date.now(),
        text: data.text,
        url: data.url,
        status: 0 // 0: Pending, 1: Denied, 2: Accepted
      })
      newReview.save(err => { if (err) return err })
      return true
    } else {
      await socket.emit("alert", "Not a valid URL")
    }
  } else {
    await socket.emit("alert", "That album has already been reviewed")
  }
}


async function requestReviewList(socket) {
  let reviews = await review.find({})
  await socket.emit("returnReviewList", reviews)
  return true
}

async function approveReview(id) {
  await review.findOne({id: id}, function (err, model) {
    if (err) return err
    model.status = 2
    model.save(err => {if(err !== undefined) return err})
    return true
  })
}

async function denyReview(id) {
  await review.findOne({id: id}, function (err, model) {
    if (err) return err
    model.status = 1
    model.save(err => {if(err !== undefined) return err})
    return true
  })
}

async function revertReview(id) {
  await review.findOne({id: id}, function (err, model) {
    if (err) return err
    model.status = 0
    model.save(err => {if(err !== undefined) return err})
    return true
  })
}


module.exports = {
  aggregator: aggregator
}