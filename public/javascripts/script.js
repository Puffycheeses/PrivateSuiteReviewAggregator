let socket = io()
socket.emit('requestReviewList')

socket.on('returnReviewList', function (data) {
  $('.pendingReviews').empty()
  $('.approvedReviews').empty()
  printData(data)
})

socket.on('alert', function (data) {
  alert(data)
})

function printData(data) {
  data.forEach(item => {
    if(item.status === 0) {
      $('.pendingReviews').append(`<div class="card">
        <div class="card-body">
            ${item.text}
            <a href=${item.url}>${item.url}</a>
        </div>
        <div class="card-footer">
            <div class="mx-auto" style="width: 50%;">
                <div class="btn-group" style="width: 100%;" role="group" aria-label="Basic example">
                    <button type="button" style="width: 100%;" class="btn btn-success" onclick="approveReview('${item.id}')">Approve</button>
                    <button type="button" style="width: 100%;" class="btn btn-danger" onclick="denyReview('${item.id}')">Deny</button>
                </div>
            </div>
        </div>
    </div>`)
    } else if (item.status === 2) {
      $('.approvedReviews').append(`<div class="card">
        <div class="card-body">
            ${item.text}
            <a href=${item.url}>${item.url}</a>
        </div>
        <div class="card-footer">
            <div class="mx-auto" style="width: 50%;">
                <div class="btn-group" style="width: 100%;" role="group" aria-label="Basic example">
                    <button type="button" style="width: 100%;" class="btn btn-warning" onclick="revertReview('${item.id}')">Revert</button>
                    <button type="button" style="width: 100%;" class="btn btn-danger" onclick="denyReview('${item.id}')">Cancel</button>
                </div>
            </div>
        </div>
    </div>`)
    }
  })
}

async function approveReview(id) {
  socket.emit('approveReview', id)
  setTimeout(function () {
    socket.emit('requestReviewList')
  }, 250);
}

async function denyReview(id) {
  socket.emit('denyReview', id)
  setTimeout(function () {
    socket.emit('requestReviewList')
  }, 250);
}

async function revertReview(id) {
  socket.emit('revertReview', id)
  setTimeout(function () {
    socket.emit('requestReviewList')
  }, 250);

}

$('.submit').click(function () {
  let reviewText = $('form .review #review').val()
  let url = $('form .link #url').val()
  socket.emit('newReview', {text: reviewText, url: url})
  socket.emit('requestReviewList')
})